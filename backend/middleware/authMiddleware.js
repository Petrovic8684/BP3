import jwt from "jsonwebtoken";
import pruzalacUslugeModel from "../models/pruzalacUslugeModel.js";

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Token nije poslat!", success: false });

  try {
    const dekodirano = jwt.verify(token, process.env.TOKEN_SECRET);
    const pruzalac = await pruzalacUslugeModel.find(dekodirano.brlicence);

    if (!pruzalac)
      return res
        .status(404)
        .json({ message: "Pružalac usluge ne postoji!", success: false });

    req.pruzalac = pruzalac;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Nevalidan ili zakasneli token!",
      success: false,
      error: error.message,
    });
  }
};

export default authMiddleware;
