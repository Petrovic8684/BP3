import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Nepoznato = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tajmer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(tajmer);
  }, [navigate]);

  return (
    <div className="text-center mt-20 text-gray-600">
      Tražena stranica ne postoji.
    </div>
  );
};

export default Nepoznato;
