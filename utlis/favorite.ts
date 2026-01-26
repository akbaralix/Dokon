import { Product } from "./addcart";

export const toggleFavorite = (
  product: Product,
  favorites: Product[],
  setFavorites: (favorites: Product[]) => void,
): void => {
  if (favorites.some((item) => item.id === product.id)) {
    setFavorites(favorites.filter((item) => item.id !== product.id));
  } else {
    setFavorites([...favorites, product]);
  }
};
