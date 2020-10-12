import CartObjectManager from "./lib/cart-object-manager";
import CartRepository from "./lib/repository";

export const handler = async (event) => {
  console.log("===== createCart.handler ======");

  const { input: cartInput } = event.arguments;

  CartObjectManager.refreshCartData(cartInput);

  return await CartRepository.createNewCart(cartInput);
};
