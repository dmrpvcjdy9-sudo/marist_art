import React, { useRef, useEffect } from "react";
import { getImage } from "../../utils/getImage";

export default function Lightbox({
  selected,
  isOpen,
  onClose,
  onNext,
  onPrev,
  isMobile,
}) {
  const lightboxRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Focus trap
  useEffect(() => {
    if (isOpen && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [isOpen]);

  // Swipe handlers
  const handleTouchStart = (e) => {
  // Ignorar si el toque empieza en el footer
  if (e.target.closest('[data-footer]')) return;
  touchStartX.current = e.touches[0].clientX;
};

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        onNext();
      } else {
        onPrev();
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!isOpen || !selected) return null;

  return (
    <div
      ref={lightboxRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Vista ampliada de ${selected.titulo}`}
      tabIndex={-1}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11, 47, 55, 0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        touchAction: "pan-y",
      }}
    >
      {/* CONTENEDOR IMAGEN */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,
    position: "relative",
    padding: isMobile ? "12px" : "20px",
    minHeight: 0,
  }}
>
  {isMobile && (
  <>
    {/* Zona izquierda */}
    <div
      onClick={(e) => {
        e.stopPropagation();
        onPrev();
      }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: "30%",
        width: "25%",
        zIndex: 5,
        cursor: "pointer",
      }}
    />
    {/* Zona derecha */}
    <div
      onClick={(e) => {
        e.stopPropagation();
        onNext();
      }}
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: "30%",
        width: "25%",
        zIndex: 5,
        cursor: "pointer",
      }}
    />
  </>
)}

  {/* FLECHA IZQUIERDA (escritorio o móvil) */}
  {!isMobile && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onPrev();
      }}
      style={arrowStyle("left", isMobile)}
      aria-label="Anterior"
    >
      ‹
    </button>
  )}

  {/* IMAGEN */}
  <img
    src={getImage(selected, "full")}
    alt={selected.titulo}
    onClick={(e) => e.stopPropagation()}
    draggable={false}
    style={{
      maxWidth: isMobile ? "90%" : "70%",
      maxHeight: "65vh",
      borderRadius: "8px",
      cursor: "default",
      userSelect: "none",
      pointerEvents: "auto",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      display: "block",
      objectFit: "contain",
      zIndex: 1,
      position: "relative",
    }}
  />

  {/* FLECHA DERECHA (escritorio) */}
  {!isMobile && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onNext();
      }}
      style={arrowStyle("right", isMobile)}
      aria-label="Siguiente"
    >
      ›
    </button>
  )}
</div>

      {/* FOOTER CON TÍTULO + DESCARGA */}
      <div
        data-footer
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxHeight: "30vh",
          overflowY: "auto",
          padding: isMobile ? "12px 14px" : "14px 20px",
          background: "rgba(0,0,0,0.7)",
          color: "#ffffff",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <h3
          style={{
            margin: "0 0 4px",
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "600",
            lineHeight: 1.2,
          }}
        >
          {selected.titulo}
        </h3>

        {/* DESCRIPCIÓN */}
        {selected.descripcion && (
          <p
            style={{
              margin: "0 0 2px",
              fontSize: isMobile ? "11px" : "13px",
              fontWeight: "300",
              opacity: 0.7,
              lineHeight: 1.3,
            }}
          >
            {selected.descripcion}
          </p>
        )}

        {/* ORIGEN · BASADO_EN */}
        {(selected.creditos?.origen || selected.creditos?.basado_en) && (
          <p
            style={{
              margin: "0 0 10px",
              fontSize: "10px",
              fontWeight: "300",
              fontStyle: "italic",
              opacity: 0.5,
              lineHeight: 1.3,
            }}
          >
            {selected.creditos?.origen === "original"
              ? "Original"
              : selected.creditos?.origen === "adaptado"
              ? "Adaptado"
              : selected.creditos?.origen}
            {selected.creditos?.origen && selected.creditos?.basado_en && " · "}
            {selected.creditos?.basado_en && `De: ${selected.creditos.basado_en}`}
          </p>
        )}

        {/* BOTÓN DESCARGAR */}
<button
  onClick={(e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = getImage(selected, "full");
    link.download = `${selected.titulo}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }}
  style={{
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "transparent",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    lineHeight: 1,
    fontFamily: "'Montserrat', sans-serif",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
  }}
>
  Descargar
</button>
      </div>
    </div>
  );
}

function arrowStyle(side, isMobile) {
  return {
    position: "absolute",
    [side]: isMobile ? "2px" : "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: isMobile ? "32px" : "44px",
    height: isMobile ? "32px" : "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isMobile ? "24px" : "32px",
    color: "rgba(255,255,255,0.7)",
    background: "rgba(0,0,0,0.3)",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: 10,
    transition: "background 0.2s ease, color 0.2s ease",
  };
}