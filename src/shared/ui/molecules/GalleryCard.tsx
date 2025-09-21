import Image from "next/image";

type GalleryCardProps = {
  title: string;
  tags: string[];
  url?: string;
  onClick?: () => void;
};

export default function GalleryCard({
  title,
  tags,
  url,
  onClick,
}: GalleryCardProps) {
  return (
    <button type="button" className="cursor-card" onClick={onClick}>
      <div className="cursor-card-image">
        {url && <Image src={url} alt={title} width={300} height={300} />}
      </div>
      <div className="cursor-card-body">
        <div className="cursor-card-title">{title}</div>
        {tags?.length && (
          <div className="cursor-tags">
            {tags.map((t) => (
              <span key={t} className="cursor-tag cursor-tag--outline">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
