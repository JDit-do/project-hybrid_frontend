import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "outline" | "solid";
};

export function Button({ variant = "outline", className = "", ...props }: ButtonProps) {
  const base = "px-4 py-1 rounded-2xl";
  const styles =
    variant === "outline"
      ? "border border-[#f6f0eb] text-[#f6f0eb] bg-transparent"
      : "bg-[#f6f0eb] text-black";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  image?: React.ReactNode;
};

export function Card({ image, children, className = "" }: CardProps) {
  return (
    <article className={`rounded-2xl border border-[#2c2c2c] overflow-hidden ${className}`}>
      <div className="h-64 bg-[#d9d9d9]">{image}</div>
      <div className="p-4 space-y-2">{children}</div>
    </article>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-xl px-2 py-0.5 bg-transparent text-xs">{children}</span>;
}


