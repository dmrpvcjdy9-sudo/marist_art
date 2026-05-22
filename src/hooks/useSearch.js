import { useState, useCallback } from "react";

export default function useSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);

  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
    setOpenPanel(null);
  }, []);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setOpenPanel(null);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  const togglePanel = useCallback((panel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }, []);

  const closePanel = useCallback(() => {
    setOpenPanel(null);
  }, []);

  return {
    searchOpen,
    setSearchOpen,
    openPanel,
    setOpenPanel,
    toggleSearch,
    openSearch,
    closeSearch,
    togglePanel,
    closePanel,
  };
}