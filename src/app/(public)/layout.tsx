import React from "react";

import MainTemplate from "@/shared/ui/templates/MainTemplate";
// import CursorScope from "./CursorScope";
// import "./cursor.scss";
// import CursorAppShell from "./_templates/CursorAppShell";

// export const metadata = {
//   title: "Cursor UI",
// };

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainTemplate>
      {children}
      {/* <CursorScope />
      <div className="cursor-page">
        <CursorAppShell>{children}</CursorAppShell>
      </div> */}
    </MainTemplate>
  );
}
