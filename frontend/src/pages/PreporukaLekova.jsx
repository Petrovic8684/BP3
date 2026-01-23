import { useState } from "react";
import Logo from "../components/logo";
import Header from "../components/header";
import SearchResult from "../components/searchResult";
import vratiKorisnika from "../lib/vratiKorisnika";
import { api } from "../lib/api";

const PreporukaLekova = () => {
  const korisnik = vratiKorisnika();
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(2);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [greska, setGreska] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setGreska(null);

    try {
      const res = await api.post("/dijagnoza/search", {
        query: query,
        limit: parseInt(limit),
      });

      if (res.data.success) {
        setResults(res.data.data);
      } else {
        setGreska("Pretraga nije uspela.");
      }
    } catch (err) {
      setGreska("Greška pri povezivanju sa serverom.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!korisnik) {
    return (
      <div className="text-center mt-20 text-gray-600">Niste prijavljeni.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header korisnik={korisnik} />
      <main className="flex flex-col items-center pt-12 px-6">
        <Logo className="mb-6" />
        <h1 className="text-2xl font-bold text-gray-700 mb-8 text-center">
          Preporuka lekova na osnovu simptoma
        </h1>

        <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                simptomi
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                rows={4}
                placeholder="Npr. Zapaljenje disajnih puteva sa temperaturom..."
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  brojrezultata:
                </label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  min="1"
                  max="10"
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`mt-6 px-8 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Pretraživanje..." : "Pronađi lekove"}
              </button>
            </div>
          </form>
        </div>

        {greska && (
          <div className="text-red-500 mb-6 bg-red-50 p-3 rounded border border-red-200">
            {greska}
          </div>
        )}

        <div className="w-full max-w-4xl space-y-6">
          {results.map((item, idx) => (
            <SearchResult key={item.sifradijagnoze || idx} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PreporukaLekova;
