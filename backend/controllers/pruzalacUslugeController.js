import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pruzalacUslugeModel from "../models/pruzalacUslugeModel.js";

export const pruzalacUslugeLogin = async (req, res) => {
  try {
    const { brlicence, lozinka } = req.body;

    if (!brlicence || !lozinka) {
      return res.status(400).json({
        message: "Nedostaju podaci za prijavu!",
        success: false,
      });
    }

    const pruzalac = await pruzalacUslugeModel.read(brlicence);
    if (!pruzalac) {
      return res.status(401).json({
        message: "Neispravan broj licence ili lozinka!",
        success: false,
      });
    }

    if (!(await bcrypt.compare(lozinka, pruzalac.lozinka))) {
      return res.status(401).json({
        message: "Neispravan broj licence ili lozinka!",
        success: false,
      });
    }

    const payload = {
      brlicence: pruzalac.brlicence,
      prezimeime: pruzalac.prezimeime,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).json({
      message: "Uspešna prijava.",
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspela prijava!",
      success: false,
      error: error.message,
    });
  }
};
