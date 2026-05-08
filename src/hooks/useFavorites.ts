import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";

type FavoriteType = "course" | "resource" | "ebook" | "ai-tool" | "foss" | "shizuku" | "morphe" | "material-you";

interface FavoriteItem {
  id: string;
  type: FavoriteType;
}

const STORAGE_KEY = "nextup_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const favoritesRef = useRef<FavoriteItem[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    favoritesRef.current = favorites;
  }, [favorites]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
        favoritesRef.current = parsed;
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  const saveFavorites = useCallback((newFavorites: FavoriteItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      favoritesRef.current = newFavorites;
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  }, []);

  const isFavorite = useCallback(
    (id: string, type: FavoriteType) => {
      return favorites.some((fav) => fav.id === id && fav.type === type);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (id: string, type: FavoriteType) => {
      // Use ref to always get the latest favorites
      const currentFavorites = favoritesRef.current;
      const exists = currentFavorites.some((fav) => fav.id === id && fav.type === type);
      const labels: Record<FavoriteType, string> = {
        "course": "Course", "resource": "Resource", "ebook": "Ebook",
        "ai-tool": "AI tool", "foss": "FOSS app", "shizuku": "Shizuku app",
        "morphe": "Morphe build", "material-you": "Material You app",
      };
      const typeLabel = labels[type] ?? "Item";
      
      if (exists) {
        const newFavorites = currentFavorites.filter((fav) => !(fav.id === id && fav.type === type));
        saveFavorites(newFavorites);
        toast({
          title: "Removed from favorites",
          description: `${typeLabel} removed from your favorites`,
        });
      } else {
        const newFavorites = [...currentFavorites, { id, type }];
        saveFavorites(newFavorites);
        toast({
          title: "Added to favorites",
          description: `${typeLabel} saved to your favorites`,
        });
      }
    },
    [saveFavorites]
  );

  const getFavoritesByType = useCallback(
    (type: FavoriteType) => {
      return favorites.filter((fav) => fav.type === type).map((fav) => fav.id);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    getFavoritesByType,
    clearFavorites,
    totalCount: favorites.length,
  };
};

// Helper to generate a consistent ID from title
export const generateId = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

// Helper to detect platform from link
export const getPlatformFromLink = (link: string): "telegram" | "drive" | "mega" | "other" => {
  if (link.includes("t.me") || link.includes("telegram")) return "telegram";
  if (link.includes("drive.google.com")) return "drive";
  if (link.includes("mega.nz")) return "mega";
  return "other";
};
