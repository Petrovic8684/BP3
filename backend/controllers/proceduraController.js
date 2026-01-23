import proceduraModel from "../models/proceduraModel.js";

export const proceduraReadAll = async (req, res) => {
  try {
    const procedure = await proceduraModel.readAll();

    if (!procedure || procedure.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedna procedura!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje procedura!",
      success: true,
      data: procedure,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje procedura!",
      success: false,
      error: error.message,
    });
  }
};
