import toast from "react-hot-toast";

export interface Product {
  id: number;
  narx: number;
  title: string;
  rasm: string;
  quantity?: number;
}

// Cartni yangilash funksiyasi
export const updateQuantity = (
  product: Product,
  delta: number,
  cart: Product[],
  setCart: (cart: Product[]) => void,
) => {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    const newQuantity = (existingItem.quantity || 1) + delta;

    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.id !== product.id));
    } else {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  } else if (delta > 0) {
    setCart([...cart, { ...product, quantity: 1 }]);
    toast.success("Mahsulot savatga qo'shildi!");
  }
};
