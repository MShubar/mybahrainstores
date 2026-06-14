type ProductTypeFilterRowProps = {
  types: string[];
  selectedType: string;
  onSelect: (type: string) => void;
};

export function ProductTypeFilterRow({
  types,
  selectedType,
  onSelect,
}: ProductTypeFilterRowProps) {
  if (types.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-gray-100 bg-white py-3">
      <div className="flex gap-2 overflow-x-auto px-4 pb-0.5 scrollbar-hide">
        {types.map((type) => {
          const active = selectedType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[#FF5A00] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
