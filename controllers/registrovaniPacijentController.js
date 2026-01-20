import registrovaniPacijentModel from "../models/registrovaniPacijentModel.js";

export const registrovaniPacijentCreate = async (req, res) => {
  try {
    const pacijent = await registrovaniPacijentModel.create(req.body);

    if (!pacijent) {
      return res.status(400).json({
        message: "Neuspelo kreiranje pacijenta!",
        success: false,
      });
    }

    res.status(201).json({
      message: "Uspelo kreiranje pacijenta!",
      success: true,
      data: pacijent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo kreiranje pacijenta!",
      success: false,
      error: error.message,
    });
  }
};

export const registrovaniPacijentRead = async (req, res) => {
  try {
    const { id } = req.params;

    const pacijent = await registrovaniPacijentModel.read(id);

    if (!pacijent) {
      return res.status(404).json({
        message: "Pacijent ne postoji!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje pacijenta!",
      success: true,
      data: pacijent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje pacijenta!",
      success: false,
      error: error.message,
    });
  }
};

export const registrovaniPacijentUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const pacijent = await registrovaniPacijentModel.update(id, req.body);

    if (!pacijent) {
      return res.status(404).json({
        message: "Pacijent ne postoji, nije moguće ažurirati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo ažuriranje pacijenta!",
      success: true,
      data: pacijent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo ažuriranje pacijenta!",
      success: false,
      error: error.message,
    });
  }
};

export const registrovaniPacijentDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const pacijent = await registrovaniPacijentModel.delete(id);

    if (!pacijent) {
      return res.status(404).json({
        message: "Pacijent ne postoji, nije moguće obrisati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo brisanje pacijenta!",
      success: true,
      data: pacijent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo brisanje pacijenta!",
      success: false,
      error: error.message,
    });
  }
};
