import dijagnozaModel from "../models/dijagnozaModel.js";

export const dijagnozaCreate = async (req, res) => {
  try {
    const dijagnoza = await dijagnozaModel.create(req.body);

    if (!dijagnoza) {
      return res.status(400).json({
        message: "Neuspelo kreiranje dijagnoze!",
        success: false,
      });
    }

    res.status(201).json({
      message: "Uspelo kreiranje dijagnoze!",
      success: true,
      data: dijagnoza,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo kreiranje dijagnoze!",
      success: false,
      error: error.message,
    });
  }
};

export const dijagnozaReadAll = async (req, res) => {
  try {
    const dijagnoze = await dijagnozaModel.readAll();

    if (!dijagnoze || dijagnoze.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedna dijagnoza!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje dijagnoza!",
      success: true,
      data: dijagnoze,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje dijagnoza!",
      success: false,
      error: error.message,
    });
  }
};

export const dijagnozaRead = async (req, res) => {
  try {
    const { id } = req.params;

    const dijagnoza = await dijagnozaModel.read(id);

    if (!dijagnoza) {
      return res.status(404).json({
        message: "Dijagnoza ne postoji!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje dijagnoze!",
      success: true,
      data: dijagnoza,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje dijagnoze!",
      success: false,
      error: error.message,
    });
  }
};

export const dijagnozaUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const dijagnoza = await dijagnozaModel.update(id, req.body);

    if (!dijagnoza) {
      return res.status(404).json({
        message: "Dijagnoza ne postoji, nije moguće ažurirati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo ažuriranje dijagnoze!",
      success: true,
      data: dijagnoza,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo ažuriranje dijagnoze!",
      success: false,
      error: error.message,
    });
  }
};

export const dijagnozaDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const dijagnoza = await dijagnozaModel.delete(id);

    if (!dijagnoza) {
      return res.status(404).json({
        message: "Dijagnoza ne postoji, nije moguće obrisati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo brisanje dijagnoze!",
      success: true,
      data: dijagnoza,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo brisanje dijagnoze!",
      success: false,
      error: error.message,
    });
  }
};

export const dijagnozaSearch = async (req, res) => {
  try {
    const dijagnoze = await dijagnozaModel.search(req.body);

    if (dijagnoze.length === 0) {
      return res.status(400).json({
        message: "Nije pronađena nijedna dijagnoza!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspela semantička pretraga dijagnoza!",
      success: true,
      data: dijagnoze,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspela semantička pretraga dijagnoza!",
      success: false,
      error: error.message,
    });
  }
};
