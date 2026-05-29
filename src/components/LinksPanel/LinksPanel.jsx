import React from "react";

const LINKS = [
  { label: "Hermanos Maristas en el mundo", url: "https://champagnat.org" },
  { label: "Colecciones de Fotos y Logos FMS", url: "https://www.flickr.com/photos/fms_champagnat/collections/" },
  { label: "Dibujos de Fano, Comunidad María de Nazaret", url: "https://sequevoycontigo.blogspot.com/p/patxi-v-fano.html" },
  { label: "Ilustraciones de Agustín de la Torre. El Jartista", url: "https://agustindelatorre.com/eljartista/" },
  { label: "Pastoral Maristas Mediterránea", url: "https://www.maristasmediterranea.com/pastoral/" },
  { label: "Escuelas Maristas en España", url: "https://maristas.es/" },
  { label: "Be Brother", url: "https://bemaristbrother.com/" },
];

export default function LinksPanel() {
  return (
    <div
      style={{
        background: "var(--bg-footer)",
        padding: "24px 20px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "var(--font-primary)",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px 24px",
        }}
      >
        {LINKS.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "var(--font-size-sm)",
              fontWeight: "300",
              fontStyle: "italic",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--accent-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.55)";
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}