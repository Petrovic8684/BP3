import izvestajLekaraSpecijalisteModel from "../models/izvestajLekaraSpecijalisteModel.js";

export const izvestajLekaraSpecijalisteCreate = async (req, res) => {
  try {
    const izvestaj = await izvestajLekaraSpecijalisteModel.create(req.body);

    if (!izvestaj) {
      return res.status(400).json({
        message: "Neuspelo kreiranje izveštaja!",
        success: false,
      });
    }

    res.status(201).json({
      message: "Uspelo kreiranje izveštaja!",
      success: true,
      data: izvestaj,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo kreiranje izveštaja!",
      success: false,
      error: error.message,
    });
  }
};

export const izvestajLekaraSpecijalisteRead = async (req, res) => {
  try {
    const { id } = req.params;

    const izvestaj = await izvestajLekaraSpecijalisteModel.read(id);

    if (!izvestaj) {
      return res.status(404).json({
        message: "Izveštaj ne postoji!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje izveštaja!",
      success: true,
      data: izvestaj,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje izveštaja!",
      success: false,
      error: error.message,
    });
  }
};

export const izvestajLekaraSpecijalisteUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const izvestaj = await izvestajLekaraSpecijalisteModel.update(id, req.body);

    if (!izvestaj) {
      return res.status(404).json({
        message: "Izveštaj ne postoji, nije moguće ažurirati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo ažuriranje izveštaja!",
      success: true,
      data: izvestaj,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo ažuriranje izveštaja!",
      success: false,
      error: error.message,
    });
  }
};

export const izvestajLekaraSpecijalisteDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const izvestaj = await izvestajLekaraSpecijalisteModel.delete(id);

    if (!izvestaj) {
      return res.status(404).json({
        message: "Izveštaj ne postoji, nije moguće obrisati!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo brisanje izveštaja!",
      success: true,
      data: izvestaj,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo brisanje izveštaja!",
      success: false,
      error: error.message,
    });
  }
};
