export default function Pagination({ page, count, limit = 10, onPageChange }) {
  const pageCount = Math.ceil(count / limit);
  if (pageCount <= 1) return null;

  return (
    <nav className="flex gap-1 mt-4">
      {Array.from({ length: pageCount }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded border text-sm transition-colors ${
            i === page
              ? 'bg-primary text-white border-primary'
              : 'border-gray-300 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </nav>
  );
}
