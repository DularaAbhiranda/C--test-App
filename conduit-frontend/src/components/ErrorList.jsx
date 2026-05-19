export default function ErrorList({ errors }) {
  if (!errors || Object.keys(errors).length === 0) return null;

  const messages = Object.entries(errors).flatMap(([field, msgs]) =>
    Array.isArray(msgs) ? msgs.map((m) => `${field} ${m}`) : [`${field} ${msgs}`]
  );

  return (
    <ul className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
      {messages.map((msg, i) => (
        <li key={i}>• {msg}</li>
      ))}
    </ul>
  );
}
