import React, { useRef, useEffect } from "react";
import { getImage } from "../../utils/getImage";

export default function Lightbox({
  selected,
  isOpen,
  onClose,
  onNext,
  onPrev,
  isMobile,
  t,     // ← para los botones (Cerrar, Descargar, etc.)
  lang,  // ← para título/descripción
}) {
  const lightboxRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const isSwiping = useRef(false);

  useEffect(() => {
    if (isOpen && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [isOpen]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    
    const diffX = Math.abs(touchStartX.current - touchEndX.current);
    const diffY = Math.abs(touchStartY.current - touchEndY.current);
    
    if (diffX > 10 && diffX > diffY) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    
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
    isSwiping.current = false;
  };

  if (!isOpen || !selected) return null;

  // 👇 TÍTULO Y DESCRIPCIÓN SEGÚN IDIOMA
  const displayTitle = lang === "en" && selected.titulo_en ? selected.titulo_en : selected.titulo;
  const displayDesc = lang === "en" && selected.descripcion_en ? selected.descripcion_en : selected.descripcion;

  return (
    <div
      ref={lightboxRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${t("lightbox.cerrar")} ${displayTitle}`}
      tabIndex={-1}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg-footer)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        touchAction: "pan-y",
      }}
    >
      {/* BOTÓN CERRAR */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: isMobile ? "10px" : "16px",
          right: isMobile ? "10px" : "16px",
          zIndex: 20,
          border: "none",
          background: "rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.8)",
          fontSize: isMobile ? "16px" : "20px",
          width: isMobile ? "32px" : "40px",
          height: isMobile ? "32px" : "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontFamily: "var(--font-primary)",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--border)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
        }}
        aria-label={t("lightbox.cerrar")}
      >
        ✕
      </button>
      
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
        {/* FLECHAS SOLO ESCRITORIO */}
        {!isMobile && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              style={arrowStyle("left")}
              aria-label={t("lightbox.anterior")}
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              style={arrowStyle("right")}
              aria-label={t("lightbox.siguiente")}
            >
              ›
            </button>
          </>
        )}

        {/* IMAGEN */}
        <img
          src={getImage(selected, "full")}
          alt={displayTitle}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
          style={{
            maxWidth: isMobile ? "95%" : "70%",
            maxHeight: isMobile ? "75vh" : "65vh",
            borderRadius: "8px",
            cursor: "default",
            userSelect: "none",
            pointerEvents: "auto",
            boxShadow: "var(--shadow-lightbox)",
            display: "block",
            objectFit: "contain",
          }}
        />
      </div>

      {/* FOOTER */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxHeight: "30vh",
          overflowY: "auto",
          padding: isMobile ? "12px 14px" : "14px 20px",
          background: "var(--bg-footer)",
          color: "var(--text-light)",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <h3 style={{ margin: "0 0 4px", fontSize: isMobile ? "14px" : "16px", fontWeight: "600", lineHeight: 1.2 }}>
          {displayTitle}
        </h3>

        {displayDesc && (
          <p style={{ margin: "0 0 2px", fontSize: isMobile ? "11px" : "13px", fontWeight: "300", opacity: 0.7, lineHeight: 1.3 }}>
            {displayDesc}
          </p>
        )}

        {(selected.creditos?.origen || selected.creditos?.basado_en) && (
          <p style={{ margin: "0 0 10px", fontSize: "10px", fontWeight: "300", fontStyle: "italic", opacity: 0.5, lineHeight: 1.3 }}>
            {selected.creditos?.origen === "original" ? t("lightbox.original") : selected.creditos?.origen === "adaptado" ? t("lightbox.adaptado") : selected.creditos?.origen}
            {selected.creditos?.origen && selected.creditos?.basado_en && " · "}
            {selected.creditos?.basado_en && `${t("lightbox.de")} ${selected.creditos.basado_en}`}
          </p>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            const link = document.createElement("a");
            link.href = getImage(selected, "full");
            link.download = `${displayTitle}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-light)",
            fontSize: "11px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            lineHeight: 1,
            fontFamily: "var(--font-primary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-overlay)";
            e.currentTarget.style.borderColor = "var(--text-light-muted)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          {t("lightbox.descargar")}
        </button>
      </div>
    </div>
  );
}

function arrowStyle(side) {
  return {
    position: "absolute",
    [side]: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    color: "var(--text-light-muted)",
    background: "rgba(0,0,0,0.3)",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: 10,
    transition: "background 0.2s ease, color 0.2s ease",
  };
}