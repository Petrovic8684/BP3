export const Uloge = {
  SPECIJALISTA: "S",
  DOKTOR: "D",
  TEHNICAR: "T",
};

export const ulogeMiddleware = (...dozvoljeneUloge) => {
  return (req, res, next) => {
    if (!req.pruzalac || !req.pruzalac.brlicence) {
      return res.status(403).json({
        message: "Pristup odbijen. Podaci o licenci nedostaju.",
        success: false,
      });
    }

    const ulogaKorisnika = req.pruzalac.brlicence.charAt(4);

    if (!dozvoljeneUloge.includes(ulogaKorisnika)) {
      return res.status(403).json({
        message: "Nemate dozvolu za pristup ovoj ruti!",
        success: false,
      });
    }
    next();
  };
};
