import { jwtDecode } from "jwt-decode";

const vratiKorisnika = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const dekodirano = jwtDecode(token);
    return {
      brlicence: dekodirano.brlicence,
      prezimeime: dekodirano.prezimeime,
      uloga: dekodirano.brlicence ? dekodirano.brlicence.charAt(4) : null,
    };
  }
  return null;
};

export default vratiKorisnika;
