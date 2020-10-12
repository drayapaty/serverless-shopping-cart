import CartRepository from "./lib/repository";

export const handler = async (event) => {
  try {
    console.log("===== getCart.handler ======");
    const { id, userToken } = event.arguments;

    if (!id && !userToken) {
      throw new Error('you must specify "id" or "userToken"');
    }

    if (id) {
      return await CartRepository.getCartById(id);
    } else {
      return await CartRepository.getCartByUserToken(userToken);
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
