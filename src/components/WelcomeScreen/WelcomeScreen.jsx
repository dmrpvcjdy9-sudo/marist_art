import React from "react";

export default function WelcomeScreen({ isMobile, onVerTodas, onAbrirFiltros }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? "24px" : "40px",
        padding: isMobile ? "40px 20px" : "60px 40px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "'Montserrat', sans-serif",
        color: "rgba(255,255,255,0.9)",
      }}
    >
      {/* Imagen decorativa */}
      <div
        style={{
          flexShrink: 0,
          width: isMobile ? "180px" : "220px",
          height: isMobile ? "180px" : "220px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          background: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/logof.png"
          alt="Marist-Art"
          style={{
            width: "80%",
            height: "80%",
            objectFit: "contain",
            opacity: 0.8,
          }}
        />
      </div>

      {/* Texto y botones */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "300",
            fontStyle: "italic",
            margin: 0,
            lineHeight: 1.3,
            color: "#ffffff",
          }}
        >
          Recursos gráficos con identidad marista
        </h2>

        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            margin: 0,
            opacity: 0.7,
            fontWeight: "300",
          }}
        >
          Un repositorio abierto de ilustraciones y diseños para la pastoral,
          la educación y la comunidad. Todo gratuito, descargable y libre de
          usar (CC BY-NC 4.0).
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          <button
            onClick={onVerTodas}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.1)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
          >
            Ver todo
          </button>
        </div>
      </div>
    </div>
  );
}