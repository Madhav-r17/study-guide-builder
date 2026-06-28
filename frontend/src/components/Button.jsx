export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm px-4 py-2.5 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent-dark",
    secondary: "bg-white text-ink border border-border hover:bg-border/30",
    danger: "bg-white text-warn border border-warn/30 hover:bg-warn/5",
    ghost: "text-ink/70 hover:text-ink hover:bg-ink/5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}