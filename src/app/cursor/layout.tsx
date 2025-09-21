import React from "react";
import CursorScope from "./CursorScope";
import CursorAppShell from "./_templates/CursorAppShell";
import "./cursor.scss";

export const metadata = {
  title: "Cursor UI",
};

export default function CursorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cursor-root">
      <CursorScope />
      <style>{`
        /* Override root body gradient within /cursor scope */
        body.cursor-scope {
          background: #2c2c2c !important;
          color: #f6f0eb !important;
        }
      `}</style>
      <div className="cursor-page">
        <CursorAppShell>{children}</CursorAppShell>
      </div>
    </div>
  );
}
