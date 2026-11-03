import Link from "next/link";

// Friendly empty state with an optional call-to-action link or button.
export default function EmptyState({
  icon: Icon,
  title,
  text,
  actionHref,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-box border border-dashed border-base-300 bg-base-200/50 px-6 py-14 text-center">
      {Icon && (
        <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
          <Icon className="h-7 w-7" />
        </span>
      )}
      <h3 className="text-xl font-bold">{title}</h3>
      {text && <p className="max-w-md text-base-content/70">{text}</p>}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn btn-primary mt-2">
          {actionLabel}
        </Link>
      )}
      {onAction && actionLabel && !actionHref && (
        <button type="button" onClick={onAction} className="btn btn-primary mt-2">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
