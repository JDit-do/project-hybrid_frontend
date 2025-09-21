import style from "./index.module.scss";

export default function ModalHeader({
  title,
  onClose,
  rounded = false,
}: {
  title?: string;
  onClose: () => void;
  rounded?: boolean;
}) {
  return (
    <header className={style.wrap}>
      {title ? <div>{title}</div> : <div />}
      <button
        type="button"
        aria-label="닫기"
        title="닫기"
        className={`${style.close} ${rounded ? style.closeRound : ""}`}
        onClick={onClose}
      >
        ×
      </button>
    </header>
  );
}
