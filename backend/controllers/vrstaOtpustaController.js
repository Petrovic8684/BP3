import vrstaOtpustaModel from "../models/vrstaOtpustaModel.js";

export const vrstaOtpustaReadAll = async (req, res) => {
  try {
    const vrsteOtpusta = await vrstaOtpustaModel.readAll();

    if (vrsteOtpusta.length === 0) {
      return res.status(400).json({
        message: "Nije pronađena nijedna vrsta otpusta!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Uspelo čitanje vrsta otpusta!",
      success: true,
      data: vrsteOtpusta,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo čitanje vrsta otpusta!",
      success: false,
      error: error.message,
    });
  }
};

export const vrstaOtpustaUpdate = async (req, res) => {
  try {
    const vrsteOtpusta = await vrstaOtpustaModel.update(req.body);

    res.status(200).json({
      message: "Uspelo ažuriranje vrsta otpusta!",
      success: true,
      data: vrsteOtpusta,
    });
  } catch (error) {
    res.status(500).json({
      message: "Neuspelo ažuriranje vrsta otpusta!",
      success: false,
      error: error.message,
    });
  }
};
