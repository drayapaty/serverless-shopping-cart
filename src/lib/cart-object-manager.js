import _ from "underscore";

const findItemById = (cart, itemId) => {
  return cart.items.find((o) => o.id === itemId);
};

const findItemIndexById = (cart, itemId) => {
  return cart.items.findIndex((o) => o.id === itemId);
};

const addItem = (cart, itemInput) => {
  //Graphql default value not supported yet by AppSync
  itemInput = _.defaults(itemInput, {
    quantity: 1,
    images: [],
    description: null,
  });

  // get item with same id if already exists in cart
  let existingItem = findItemById(cart, itemInput.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + itemInput.quantity;
    Object.assign(existingItem, itemInput);
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push(itemInput);
  }

  refreshCartData(cart);
  return true;
};

const updateCart = (cart, newCartData) => {
  if (!cart || !newCartData) {
    return false;
  }

  Object.assign(cart, newCartData);
  refreshCartData(cart);
  return true;
};

const updateItem = (cart, newItemData) => {
  const item = findItemById(cart, newItemData.id);

  if (!item || !newItemData) {
    return false;
  }
  Object.assign(item, newItemData);
  refreshCartData(cart);
  return true;
};

const removeItemById = (cart, itemId) => {
  const index = findItemIndexById(cart, itemId);

  if (index !== -1) {
    cart.items.splice(index, 1);
  }

  refreshCartData(cart);
  return true;
};

const emptyCart = (cart) => {
  cart.items = [];
  refreshCartData(cart);
  return true;
};

const getMoneyObject = (amount, currency) => {
  const displayAmount = amount / 100;
  return {
    amount,
    currency,
    formatted: new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(displayAmount),
  };
};

const refreshItemData = (cart, item) => {
  if (item.price) {
    item.unitTotal = getMoneyObject(item.price, cart.currency);
    delete item["price"];
  }

  const totalAmount = item.unitTotal.amount * item.quantity;
  item.lineTotal = getMoneyObject(totalAmount, cart.currency);

  return true;
};

const refreshCartData = (cart) => {
  let totalItems = 0;
  let cartSubTotal = 0;

  if (!cart.items) {
    cart.items = [];
  }

  for (const item of cart.items) {
    refreshItemData(cart, item);
    const { lineTotal, quantity } = item;
    cartSubTotal += lineTotal.amount;
    totalItems += quantity;
  }

  cart.totalItems = totalItems;
  cart.totalUniqueItems = cart.items.length;
  cart.isEmpty = cart.totalItems === 0;
  cart.subTotal = getMoneyObject(cartSubTotal, cart.currency);
  cart.attributes = [];

  return true;
};

const CartObjectManager = {
  findItemById,
  findItemIndexById,
  addItem,
  updateItem,
  removeItemById,
  emptyCart,
  refreshCartData,
  updateCart,
};

export default CartObjectManager;
