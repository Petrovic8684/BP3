import mestoModel from "../models/mestoModel.js";

export const mestoReadAll = async (req, res) => {
  try {
    const mesta = await mestoModel.readAll();

    if (!mesta || mesta.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedno mesto!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje mesta!",
      success: true,
      data: mesta,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje mesta!",
      success: false,
      error: error.message,
    });
  }
};
