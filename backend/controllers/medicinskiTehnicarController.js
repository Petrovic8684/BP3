import medicinskiTehnicarModel from "../models/medicinskiTehnicarModel.js";

export const medicinskiTehnicarReadAll = async (req, res) => {
  try {
    const tehnicari = await medicinskiTehnicarModel.readAll();

    if (!tehnicari || tehnicari.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedan medicinski tehničar!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje medicinskog tehničara!",
      success: true,
      data: tehnicari,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje medicinskog tehničara!",
      success: false,
      error: error.message,
    });
  }
};
