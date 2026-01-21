import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Odjava = ({ korisnik }) => {
  const navigate = useNavigate();

  if (!korisnik) return <></>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/prijava");
  };

  return (
    <header className="w-full flex justify-end p-4 bg-gray-100">
      <div className="w-full flex justify-end p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-teal-500 hover:text-teal-700 font-semibold"
        >
          <span>Odjava</span>
          <FiLogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Odjava;
