import CartObjectManager from "./lib/cart-object-manager";
import CartRepository from "./lib/repository";

export const handler = async (event) => {
  try {
    console.log("===== emptyCart.handler ======");

    const { id } = event.arguments.input;

    const cart = await CartRepository.getCartById(id);
    if (!cart) {
      throw new Error(`Cart not found`);
    }
    CartObjectManager.emptyCart(cart);

    return await CartRepository.updateCart(cart);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
