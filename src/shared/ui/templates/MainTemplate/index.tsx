import Header from "@/shared/ui/organisms/Header";

import style from "./indext.module.scss";
import "@/app/cursor/cursor.scss";

export default function MainTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={style.wrap}>
      <Header />
      <main>{children}</main>
    </div>
  );
}
