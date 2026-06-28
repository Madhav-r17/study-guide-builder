export default function Card({ children, className = "", accent = null }) {
  return (
    <div
      className={`relative bg-white rounded-xl border border-border shadow-card overflow-hidden ${className}`}
    >
      {accent && (
        <span className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} aria-hidden="true" />
      )}
      <div className={accent ? "pl-5 pr-5 py-5" : "p-5"}>{children}</div>
    </div>
  );
}