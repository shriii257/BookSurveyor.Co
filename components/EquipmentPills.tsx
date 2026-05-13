export function EquipmentPills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-md bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary-dark">
          {item}
        </span>
      ))}
    </div>
  );
}
