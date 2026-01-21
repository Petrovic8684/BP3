import istorijaBolestiModel from "../models/istorijaBolestiModel.js";

export const istorijaBolestiCreate = async (req, res) => {
  try {
    const istorija = await istorijaBolestiModel.create(req.body);

    if (!istorija) {
      return res.status(400).json({
        message: "Neuspelo kreiranje istorije bolesti!",
        success: false,
      });
    }

    res.status(201).json({
      message: "Uspelo kreiranje istorije bolesti!",
      success: true,
      data: istorija,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo kreiranje istorije bolesti!",
      success: false,
      error: error.message,
    });
  }
};

export const istorijaBolestiReadAll = async (req, res) => {
  try {
    const istorije = await istorijaBolestiModel.readAll();

    if (!istorije || istorije.length === 0) {
      return res.status(404).json({
        message: "Ne postoji nijedna istorija bolesti!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje istorija bolesti!",
      success: true,
      data: istorije,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje istorija bolesti!",
      success: false,
      error: error.message,
    });
  }
};

export const istorijaBolestiRead = async (req, res) => {
  try {
    const { id } = req.params;

    const istorija = await istorijaBolestiModel.read(id);

    if (!istorija) {
      return res.status(404).json({
        message: "Istorija bolesti ne postoji!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje istorije bolesti!",
      success: true,
      data: istorija,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje istorije bolesti!",
      success: false,
      error: error.message,
    });
  }
};

export const istorijaBolestiUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const istorija = await istorijaBolestiModel.update(id, req.body);

    if (!istorija) {
      return res.status(404).json({
        message: "Istorija bolesti ne postoji, nije moguće ažurirati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo ažuriranje istorije bolesti!",
      success: true,
      data: istorija,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo ažuriranje istorije bolesti!",
      success: false,
      error: error.message,
    });
  }
};

export const istorijaBolestiDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const istorija = await istorijaBolestiModel.delete(id);

    if (!istorija) {
      return res.status(404).json({
        message: "Istorija bolesti ne postoji, nije moguće obrisati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo brisanje istorije bolesti!",
      success: true,
      data: istorija,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo brisanje istorije bolesti!",
      success: false,
      error: error.message,
    });
  }
};
