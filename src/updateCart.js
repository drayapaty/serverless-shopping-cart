import CartObjectManager from "./lib/cart-object-manager";
import CartRepository from "./lib/repository";

export const handler = async (event) => {
  try {
    console.log("===== updateCart.handler ======");

    const { input: cartUpdateInput } = event.arguments;

    const { id } = cartUpdateInput;

    const cart = await CartRepository.getCartById(id);
    if (!cart) {
      throw new Error(`Cart not found`);
    }

    CartObjectManager.updateCart(cart, cartUpdateInput);

    return await CartRepository.updateCart(cart);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
