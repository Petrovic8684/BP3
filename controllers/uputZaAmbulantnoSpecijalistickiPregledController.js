import uputZaAmbulantnoSpecijalistickiPregledModel from "../models/uputZaAmbulantnoSpecijalistickiPregledModel.js";

export const uputZaAmbulantnoSpecijalistickiPregledCreate = async (
  req,
  res,
) => {
  try {
    const uput = await uputZaAmbulantnoSpecijalistickiPregledModel.create(
      req.body,
    );

    if (!uput) {
      return res.status(400).json({
        message: "Neuspelo kreiranje uputa!",
        success: false,
      });
    }

    res.status(201).json({
      message: "Uspelo kreiranje uputa!",
      success: true,
      data: uput,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo kreiranje uputa!",
      success: false,
      error: error.message,
    });
  }
};

export const uputZaAmbulantnoSpecijalistickiPregledRead = async (req, res) => {
  try {
    const { id } = req.params;

    const uput = await uputZaAmbulantnoSpecijalistickiPregledModel.read(id);

    if (!uput) {
      return res.status(404).json({
        message: "Uput ne postoji!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje uputa!",
      success: true,
      data: uput,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje uputa!",
      success: false,
      error: error.message,
    });
  }
};

export const uputZaAmbulantnoSpecijalistickiPregledUpdate = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;

    const uput = await uputZaAmbulantnoSpecijalistickiPregledModel.update(
      id,
      req.body,
    );

    if (!uput) {
      return res.status(404).json({
        message: "Uput ne postoji, nije moguće ažurirati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo ažuriranje uputa!",
      success: true,
      data: uput,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo ažuriranje uputa!",
      success: false,
      error: error.message,
    });
  }
};

export const uputZaAmbulantnoSpecijalistickiPregledDelete = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;

    const uput = await uputZaAmbulantnoSpecijalistickiPregledModel.delete(id);

    if (!uput) {
      return res.status(404).json({
        message: "Uput ne postoji, nije moguće obrisati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo brisanje uputa!",
      success: true,
      data: uput,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo brisanje uputa!",
      success: false,
      error: error.message,
    });
  }
};
