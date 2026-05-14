import React, { useRef, useState, useEffect } from "react";

export default function LazyImage({ src, alt }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.01,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      {/* Placeholder animado */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #f0f0f0, #f5f5f5)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      )}

      {/* Imagen real */}
      {visible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}
    </div>
  );
}