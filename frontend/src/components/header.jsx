import { useNavigate, useLocation } from "react-router-dom";
import { FiLogOut, FiArrowLeft } from "react-icons/fi";

const Header = ({ korisnik }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!korisnik) return <></>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/prijava");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <header className="w-full flex justify-between items-center p-12 bg-gray-100">
      {location.pathname !== "/" ? (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-teal-500 hover:text-teal-700 font-semibold"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Nazad</span>
        </button>
      ) : (
        <div />
      )}

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-teal-500 hover:text-teal-700 font-semibold"
      >
        <span>Odjava</span>
        <FiLogOut className="w-5 h-5" />
      </button>
    </header>
  );
};

export default Header;
