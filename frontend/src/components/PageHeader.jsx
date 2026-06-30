export default function PageHeader({ title, description, children }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink tracking-tight">
          {title}
        </h1>
        {description && <p className="text-ink/60 mt-1.5">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
