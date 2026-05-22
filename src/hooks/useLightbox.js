import { useState, useEffect, useRef, useCallback } from "react";
import { getImage } from "../utils/getImage";

export default function useLightbox(filtered, setSelected) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selected, setSelectedLocal] = useState(null);
  const gridScrollRef = useRef(0);

  // Sincronizar selected interno con el externo
  const changeSelected = useCallback((item) => {
    setSelectedLocal(item);
    setSelected(item);
    setLightboxOpen(true);
  }, [setSelected]);

  // Cerrar lightbox
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setSelectedLocal(null);
    setSelected(null);
    setTimeout(() => {
      window.scrollTo({ top: gridScrollRef.current });
    }, 50);
  }, [setSelected]);

  // Navegación
  const goNext = useCallback(() => {
    if (!selected) return;
    const index = filtered.findIndex((i) => i.id === selected.id);
    if (filtered[index + 1]) {
      const next = filtered[index + 1];
      setSelectedLocal(next);
      setSelected(next);
    }
  }, [selected, filtered, setSelected]);

  const goPrev = useCallback(() => {
    if (!selected) return;
    const index = filtered.findIndex((i) => i.id === selected.id);
    if (filtered[index - 1]) {
      const prev = filtered[index - 1];
      setSelectedLocal(prev);
      setSelected(next);
    }
  }, [selected, filtered, setSelected]);

  // Precarga imágenes adyacentes
  useEffect(() => {
    if (!selected) return;
    const index = filtered.findIndex((i) => i.id === selected.id);
    const next = filtered[index + 1];
    if (next) new Image().src = getImage(next, "full");
    const prev = filtered[index - 1];
    if (prev) new Image().src = getImage(prev, "full");
  }, [selected, filtered]);

  // Scroll lock
  useEffect(() => {
    if (lightboxOpen) {
      gridScrollRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${gridScrollRef.current}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [lightboxOpen]);

  // Teclado
  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, goNext, goPrev, closeLightbox]);

  // URL hash
  useEffect(() => {
    if (selected) {
      window.history.replaceState(null, "", `#${selected.id}`);
    }
  }, [selected]);

  return {
    lightboxOpen,
    selected: selected,
    changeSelected,
    closeLightbox,
    goNext,
    goPrev,
  };
}