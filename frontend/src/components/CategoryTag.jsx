const CATEGORY_STYLES = {
  DBMS: { label: "DBMS", bg: "bg-cat-dbms/10", text: "text-cat-dbms", dot: "bg-cat-dbms" },
  OS: { label: "OS", bg: "bg-cat-os/10", text: "text-cat-os", dot: "bg-cat-os" },
  DSA: { label: "DSA", bg: "bg-cat-dsa/10", text: "text-cat-dsa", dot: "bg-cat-dsa" },
  SE: { label: "Software Engineering", bg: "bg-cat-se/10", text: "text-cat-se", dot: "bg-cat-se" },
};

export const CATEGORY_OPTIONS = ["DBMS", "OS", "DSA", "SE"];

export function categoryColor(category) {
  return CATEGORY_STYLES[category]?.dot || "bg-ink/30";
}

export default function CategoryTag({ category, size = "sm" }) {
  const style = CATEGORY_STYLES[category] || {
    label: category || "Uncategorized",
    bg: "bg-ink/5",
    text: "text-ink/60",
    dot: "bg-ink/30",
  };

  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${style.bg} ${style.text} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
