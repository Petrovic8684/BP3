import nalogZaDavanjeInjekcijaModel from "../models/nalogZaDavanjeInjekcijaModel.js";

export const nalogZaDavanjeInjekcijaCreate = async (req, res) => {
  try {
    const nalog = await nalogZaDavanjeInjekcijaModel.create(req.body);

    if (!nalog) {
      return res.status(400).json({
        message: "Neuspelo kreiranje naloga!",
        success: false,
      });
    }

    res.status(201).json({
      message: "Uspelo kreiranje naloga!",
      success: true,
      data: nalog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo kreiranje naloga!",
      success: false,
      error: error.message,
    });
  }
};

export const nalogZaDavanjeInjekcijaRead = async (req, res) => {
  try {
    const { id } = req.params;

    const nalog = await nalogZaDavanjeInjekcijaModel.read(id);

    if (!nalog) {
      return res.status(404).json({
        message: "Nalog ne postoji!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje naloga!",
      success: true,
      data: nalog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje naloga!",
      success: false,
      error: error.message,
    });
  }
};

export const nalogZaDavanjeInjekcijaUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const nalog = await nalogZaDavanjeInjekcijaModel.update(id, req.body);

    if (!nalog) {
      return res.status(404).json({
        message: "Nalog ne postoji, nije moguće ažurirati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo ažuriranje naloga!",
      success: true,
      data: nalog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo ažuriranje naloga!",
      success: false,
      error: error.message,
    });
  }
};

export const nalogZaDavanjeInjekcijaDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const nalog = await nalogZaDavanjeInjekcijaModel.delete(id);

    if (!nalog) {
      return res.status(404).json({
        message: "Nalog ne postoji, nije moguće obrisati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo brisanje naloga!",
      success: true,
      data: nalog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo brisanje naloga!",
      success: false,
      error: error.message,
    });
  }
};
