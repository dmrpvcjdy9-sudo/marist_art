import React from "react";

export default function Pagination({ page, setPage, filteredLength, pageSize }) {
  if (filteredLength <= pageSize) return null;

  const totalPages = Math.ceil(filteredLength / pageSize);

  const btnStyle = (disabled) => ({
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
    borderRadius: "8px",
    padding: "6px 14px",
    cursor: disabled ? "default" : "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  });

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "14px",
        margin: "20px 0",
        fontSize: "13px",
        color: "rgba(255,255,255,0.6)",
        fontWeight: "300",
      }}
    >
      <button
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 1}
        style={btnStyle(page === 1)}
      >
        ←
      </button>

      <span>{page} / {totalPages}</span>

      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={page * pageSize >= filteredLength}
        style={btnStyle(page * pageSize >= filteredLength)}
      >
        →
      </button>
    </div>
  );
}