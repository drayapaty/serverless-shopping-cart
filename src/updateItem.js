import CartObjectManager from "./lib/cart-object-manager";
import CartRepository from "./lib/repository";

export const handler = async (event) => {
  try {
    console.log("===== updateItem.handler ======");

    const { input: itemInput } = event.arguments;
    const { cartId } = itemInput;

    const cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      throw new Error(`Cart not found`);
    }
    CartObjectManager.updateItem(cart, itemInput);

    return await CartRepository.updateCart(cart);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
