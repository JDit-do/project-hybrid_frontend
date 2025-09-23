export default function CursorHomePage() {
  return (
    <main>
      <section className="cursor-section">
        <div className="cursor-grid">
          {Array.from({ length: 8 }).map((_, idx) => (
            <article key={idx} className="cursor-card">
              <div className="cursor-card-image" />
              <div className="cursor-card-body">
                <div className="cursor-card-title">
                  제목제목제목제목제목제목제목제목제목제목제목....
                </div>
                <div className="cursor-tags">
                  {Array.from({ length: 5 }).map((__, tIdx) => (
                    <span key={tIdx} className="cursor-tag">
                      #태그태그그
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
