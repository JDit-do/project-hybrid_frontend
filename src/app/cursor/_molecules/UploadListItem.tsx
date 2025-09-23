export default function UploadListItem({ name, progress, onRemove }: { name: string; progress: number; onRemove?: () => void }) {
  return (
    <div className="cursor-upload-item">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="삭제"
          title="삭제"
          style={{ marginRight: 8, appearance: 'none', background: 'transparent', border: 0, color: 'inherit', fontSize: 22, lineHeight: 1 }}
        >
          ×
        </button>
      )}
      <div className="cursor-upload-name" title={name}>{name}</div>
      <div className="cursor-upload-bar">
        <div className="cursor-upload-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}


