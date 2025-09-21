import BrandLogo from "./internal/BrandLogo";
import BrandLine from "./internal/BrandLine";

import style from "./index.module.scss";

type BrandProps = {
  title?: string;
  subtitle?: string;
  stackedMark?: boolean;
  animated?: boolean;
};

export default function Brand({
  title = "memory",
  subtitle = "a prism",
  stackedMark = true,
}: BrandProps) {
  return (
    <div className={`${style.wrap} cursor-brand`}>
      <div className={stackedMark ? "cursor-brand-mark" : undefined}>
        <BrandLogo />
        <BrandLine />
      </div>
      <h1 className={style.title_wrap} aria-roledescription="memory">
        <div className={style.title_project}>{title}</div>
        <div className={style.title_team}>{subtitle}</div>
      </h1>
    </div>
  );
}
