import React, { useRef, useState, useEffect } from "react";

export default function LazyImage({ src, alt }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = src;
          img.onload = () => setLoaded(true);
          img.onerror = () => setError(true);
          observer.unobserve(el);
        }
      },
      {
        rootMargin: "400px 0px", // muy agresivo
        threshold: 0,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [src]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#f0f0f0",
        overflow: "hidden",
      }}
    >
      {/* Placeholder animado mientras carga */}
      {!loaded && !error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #f0f0f0, #f5f5f5)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      )}

      {/* Imagen cargada */}
      {loaded && (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: 1,
            transition: "opacity 0.3s ease",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: "11px",
          }}
        >
          Sin imagen
        </div>
      )}
    </div>
  );
}