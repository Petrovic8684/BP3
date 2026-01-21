import uputZaStacionarnoLecenjeModel from "../models/uputZaStacionarnoLecenjeModel.js";

export const uputZaStacionarnoLecenjeCreate = async (req, res) => {
  try {
    const uput = await uputZaStacionarnoLecenjeModel.create(req.body);

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

export const uputZaStacionarnoLecenjeReadAll = async (req, res) => {
  try {
    const uputi = await uputZaStacionarnoLecenjeModel.readAll();

    if (!uputi || uputi.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedan uput!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje uputa!",
      success: true,
      data: uputi,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje uputa!",
      success: false,
      error: error.message,
    });
  }
};

export const uputZaStacionarnoLecenjeRead = async (req, res) => {
  try {
    const { id } = req.params;

    const uput = await uputZaStacionarnoLecenjeModel.read(id);

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

export const uputZaStacionarnoLecenjeUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const uput = await uputZaStacionarnoLecenjeModel.update(id, req.body);

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

export const uputZaStacionarnoLecenjeDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const uput = await uputZaStacionarnoLecenjeModel.delete(id);

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
