import React from "react";

export default function Pagination({ page, setPage, filteredLength, pageSize }) {
  const totalPages = Math.ceil(filteredLength / pageSize);
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "6px",
      margin: "16px 0",
      fontFamily: "var(--font-primary)",
      fontSize: "12px",
      color: "rgba(255,255,255,0.6)",
    }}>
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
        style={btnStyle(page === 1)}>←</button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} style={{ padding: "4px 6px", opacity: 0.5 }}>...</span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              ...btnStyle(false),
              background: p === page ? "var(--accent)" : "transparent",
              color: p === page ? "var(--bg-surface)" : "rgba(255,255,255,0.6)",
              border: p === page ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.15)",
              fontWeight: p === page ? "600" : "400",
            }}
          >
            {p}
          </button>
        )
      )}

      <button onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= filteredLength}
        style={btnStyle(page * pageSize >= filteredLength)}>→</button>
    </div>
  );
}

const btnStyle = (disabled) => ({
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.15)",
  color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
  borderRadius: "6px",
  padding: "4px 10px",
  cursor: disabled ? "default" : "pointer",
  fontSize: "12px",
  fontFamily: "var(--font-primary)",
  transition: "all 0.15s ease",
});