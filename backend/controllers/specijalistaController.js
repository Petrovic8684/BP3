import specijalistaModel from "../models/specijalistaModel.js";

export const specijalistaReadAll = async (req, res) => {
  try {
    const specijaliste = await specijalistaModel.readAll();

    if (!specijaliste || specijaliste.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedan specijalista!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje specijalista!",
      success: true,
      data: specijaliste,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje specijalista!",
      success: false,
      error: error.message,
    });
  }
};
