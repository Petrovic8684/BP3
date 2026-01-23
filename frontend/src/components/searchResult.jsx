const SearchResult = ({ item }) => {
  return (
    <div className="bg-white border-l-4 border-teal-500 shadow-sm rounded-r-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {item.sifradijagnoze} - {item.naziv}
          </h2>
          <p className="text-gray-600 mt-1 italic">{item.opis}</p>
        </div>
        <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold border border-teal-100 shrink-0 ml-4">
          Sličnost: {(item.slicnost * 100).toFixed(1)}%
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Preporučeni lekovi:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {item.lekovi && item.lekovi.length > 0 ? (
            item.lekovi.map((lek, lIdx) => (
              <div
                key={lek.jkl || lIdx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 hover:border-teal-300 transition-colors"
              >
                <span className="font-medium text-gray-700">{lek.naziv}</span>
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                  {lek.jacina} {lek.jedinica}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">Nema preporučenih lekova.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
