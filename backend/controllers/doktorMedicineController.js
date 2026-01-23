import doktorMedicineModel from "../models/doktorMedicineModel.js";

export const doktorMedicineReadAll = async (req, res) => {
  try {
    const doktori = await doktorMedicineModel.readAll();

    if (!doktori || doktori.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedan doktor medicine!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje doktora medicine!",
      success: true,
      data: doktori,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje doktora medicine!",
      success: false,
      error: error.message,
    });
  }
};
