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
    
    // Solo considerar swipe si es más horizontal que vertical
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
        background: "rgba(11, 47, 55, 0.92)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        touchAction: "pan-y",
      }}
    >
        {/* BOTÓN CERRAR (siempre visible) */}
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
      fontFamily: "'Montserrat', sans-serif",
      transition: "background 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.3)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.15)";
    }}
    aria-label="Cerrar"
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
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              style={arrowStyle("right")}
              aria-label="Siguiente"
            >
              ›
            </button>
          </>
        )}

        {/* IMAGEN */}
        <img
          src={getImage(selected, "full")}
          alt={selected.titulo}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
          style={{
            maxWidth: isMobile ? "95%" : "70%",
            maxHeight: isMobile ? "75vh" : "65vh",
            borderRadius: "8px",
            cursor: "default",
            userSelect: "none",
            pointerEvents: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
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
          background: "rgba(0,0,0,0.5)",
          color: "#ffffff",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <h3 style={{ margin: "0 0 4px", fontSize: isMobile ? "14px" : "16px", fontWeight: "600", lineHeight: 1.2 }}>
          {selected.titulo}
        </h3>

        {selected.descripcion && (
          <p style={{ margin: "0 0 2px", fontSize: isMobile ? "11px" : "13px", fontWeight: "300", opacity: 0.7, lineHeight: 1.3 }}>
            {selected.descripcion}
          </p>
        )}

        {(selected.creditos?.origen || selected.creditos?.basado_en) && (
          <p style={{ margin: "0 0 10px", fontSize: "10px", fontWeight: "300", fontStyle: "italic", opacity: 0.5, lineHeight: 1.3 }}>
            {selected.creditos?.origen === "original" ? "Original" : selected.creditos?.origen === "adaptado" ? "Adaptado" : selected.creditos?.origen}
            {selected.creditos?.origen && selected.creditos?.basado_en && " · "}
            {selected.creditos?.basado_en && `De: ${selected.creditos.basado_en}`}
          </p>
        )}

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
    color: "rgba(255,255,255,0.7)",
    background: "rgba(0,0,0,0.3)",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: 10,
    transition: "background 0.2s ease, color 0.2s ease",
  };
}