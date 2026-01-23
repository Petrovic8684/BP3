import otpusnaListaModel from "../models/otpusnaListaModel.js";

export const otpusnaListaCreate = async (req, res) => {
  try {
    const lista = await otpusnaListaModel.create(req.body);

    if (!lista) {
      return res.status(400).json({
        message: "Neuspelo kreiranje otpusne liste!",
        success: false,
      });
    }

    res.status(201).json({
      message: "Uspelo kreiranje otpusne liste!",
      success: true,
      data: lista,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo kreiranje otpusne liste!",
      success: false,
      error: error.message,
    });
  }
};

export const otpusnaListaReadAll = async (req, res) => {
  try {
    const brlicenceFilter = req.pruzalac.brlicence;

    const liste = await otpusnaListaModel.readAll(brlicenceFilter);

    if (!liste || liste.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedna otpusna lista!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje otpusnih lista!",
      success: true,
      data: liste,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje otpusnih lista!",
      success: false,
      error: error.message,
    });
  }
};

export const otpusnaListaRead = async (req, res) => {
  try {
    const { id } = req.params;

    const lista = await otpusnaListaModel.read(id);

    if (!lista) {
      return res.status(404).json({
        message: "Otpusna lista ne postoji!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje otpusne liste!",
      success: true,
      data: lista,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje otpusne liste!",
      success: false,
      error: error.message,
    });
  }
};

export const otpusnaListaUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const lista = await otpusnaListaModel.update(id, req.body);

    if (!lista) {
      return res.status(404).json({
        message: "Otpusna lista ne postoji, nije moguće ažurirati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo ažuriranje otpusne liste!",
      success: true,
      data: lista,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo ažuriranje otpusne liste!",
      success: false,
      error: error.message,
    });
  }
};

export const otpusnaListaDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const lista = await otpusnaListaModel.delete(id);

    if (!lista) {
      return res.status(404).json({
        message: "Otpusna lista ne postoji, nije moguće obrisati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo brisanje otpusne liste!",
      success: true,
      data: lista,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo brisanje otpusne liste!",
      success: false,
      error: error.message,
    });
  }
};
