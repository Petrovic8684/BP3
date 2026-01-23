import lekModel from "../models/lekModel.js";

export const lekCreate = async (req, res) => {
  try {
    const lek = await lekModel.create(req.body);

    if (!lek) {
      return res.status(400).json({
        message: "Neuspelo kreiranje leka!",
        success: false,
      });
    }

    res.status(201).json({
      message: "Uspelo kreiranje leka!",
      success: true,
      data: lek,
    });
  } catch (error) {
    res.status(500).json({
      message: "Greška pri kreiranju leka!",
      success: false,
      error: error.message,
    });
  }
};

export const lekReadAll = async (req, res) => {
  try {
    const { forma } = req.query;
    const lekovi = await lekModel.readAll({
      forme: Array.isArray(forma) ? forma : [forma],
    });

    if (!lekovi || lekovi.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedan lek!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje lekova!",
      success: true,
      data: lekovi,
    });
  } catch (error) {
    res.status(500).json({
      message: "Greška pri čitanju lekova!",
      success: false,
      error: error.message,
    });
  }
};

export const lekRead = async (req, res) => {
  try {
    const { id } = req.params;

    const lek = await lekModel.read(id);

    if (!lek) {
      return res.status(404).json({
        message: "Lek ne postoji!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje leka!",
      success: true,
      data: lek,
    });
  } catch (error) {
    res.status(500).json({
      message: "Greška pri čitanju leka!",
      success: false,
      error: error.message,
    });
  }
};

export const lekUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const lek = await lekModel.update(id, req.body);

    if (!lek) {
      return res.status(404).json({
        message: "Lek ne postoji, nije moguće ažurirati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo ažuriranje leka!",
      success: true,
      data: lek,
    });
  } catch (error) {
    res.status(500).json({
      message: "Greška pri ažuriranju leka!",
      success: false,
      error: error.message,
    });
  }
};

export const lekDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const lek = await lekModel.delete(id);

    if (!lek) {
      return res.status(404).json({
        message: "Lek ne postoji, nije moguće obrisati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo brisanje leka!",
      success: true,
      data: lek,
    });
  } catch (error) {
    res.status(500).json({
      message: "Greška pri brisanju leka!",
      success: false,
      error: error.message,
    });
  }
};
