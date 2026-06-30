export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl border border-dashed border-border bg-white/50">
      {icon && <div className="text-3xl mb-3 opacity-70">{icon}</div>}
      <p className="font-serif text-lg text-ink font-medium">{title}</p>
      {description && <p className="text-ink/55 text-sm mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
