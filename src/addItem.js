import CartObjectManager from "./lib/cart-object-manager";
import CartRepository from "./lib/repository";

export const handler = async (event) => {
  try {
    console.log("===== addItem.handler ======");

    const { input: itemInput } = event.arguments;

    const { cartId } = itemInput;

    delete itemInput["cartId"];

    const cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      throw new Error(`Cart not found`);
    }
    CartObjectManager.addItem(cart, itemInput);

    return await CartRepository.updateCart(cart);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
