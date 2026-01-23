import odeljenjeModel from "../models/odeljenjeModel.js";

export const odeljenjeReadAll = async (req, res) => {
  try {
    const odeljenja = await odeljenjeModel.readAll();

    if (!odeljenja || odeljenja.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedno odeljenje!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje odeljenja!",
      success: true,
      data: odeljenja,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje odeljenja!",
      success: false,
      error: error.message,
    });
  }
};
