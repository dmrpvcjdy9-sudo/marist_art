import React, { useRef, useState, useEffect } from "react";
import AboutPanel from "./AboutPanel";
import ContactPanel from "./ContactPanel";

function useClickOutside(ref, callback) {
  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) callback();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, callback]);
}

export default function Infopanels() {
  const [openPanel, setOpenPanel] = useState(null);
  const [hoveredPanel, setHoveredPanel] = useState(null);
  const panelsRef = useRef(null);

  useClickOutside(panelsRef, () => setOpenPanel(null));

  return (
    <div
      id="info-panels"
      ref={panelsRef}
      style={{
        background: "var(--bg-footer)",
        padding: "40px 20px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          alignItems: "flex-start",
          justifyContent: "center",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* PANEL IZQUIERDO: Presentación */}
        <AboutPanel
          isOpen={openPanel === "left"}
          onToggle={() =>
            setOpenPanel(openPanel === "left" ? null : "left")
          }
          hovered={hoveredPanel}
          onHover={setHoveredPanel}
          onLeave={() => setHoveredPanel(null)}
        />

        {/* PANEL DERECHO: Contacto */}
        <ContactPanel
          isOpen={openPanel === "right"}
          onToggle={() =>
            setOpenPanel(openPanel === "right" ? null : "right")
          }
          hovered={hoveredPanel}
          onHover={setHoveredPanel}
          onLeave={() => setHoveredPanel(null)}
        />
      </div>
    </div>
  );
}