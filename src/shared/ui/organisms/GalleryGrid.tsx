import GalleryCard from "@/shared/ui/molecules/GalleryCard";

type Item = { id: string; title: string; tags: string[]; url: string };

export default function GalleryGrid({
  items,
  onItemClick,
}: {
  items: Item[];
  onItemClick?: (id: string) => void;
}) {
  return (
    <div className="cursor-grid">
      {items.map((it) => {
        return (
          <GalleryCard
            key={it.id}
            title={it.title}
            tags={it.tags}
            url={it.url}
            onClick={onItemClick ? () => onItemClick(it.id) : undefined}
          />
        );
      })}
    </div>
  );
}
