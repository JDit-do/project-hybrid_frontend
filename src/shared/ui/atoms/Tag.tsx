export default function Tag({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "inverted" | "outline";
  className?: string;
}) {
  const classes = [
    "cursor-tag",
    variant === "inverted" ? "cursor-tag--inverted" : "",
    variant === "outline" ? "cursor-tag--outline" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <span className={classes}>{children}</span>;
}
