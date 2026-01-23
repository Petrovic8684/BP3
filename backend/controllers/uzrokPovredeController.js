import uzrokPovredeModel from "../models/uzrokPovredeModel.js";

export const uzrokPovredeReadAll = async (req, res) => {
  try {
    const uzroci = await uzrokPovredeModel.readAll();

    if (!uzroci || uzroci.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedan uzrok povrede!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje uzroka povrede!",
      success: true,
      data: uzroci,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje uzroka povrede!",
      success: false,
      error: error.message,
    });
  }
};
