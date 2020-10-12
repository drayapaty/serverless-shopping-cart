import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const TableName = process.env.TABLE_NAME;
const region = process.env.AWS_REGION;
const docClient = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region,
});

const createNewCart = async (cartInput) => {
  const Item = {
    id: uuidv4(),
    ...cartInput,
    abandoned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const params = {
    TableName,
    Item,
  };

  await docClient.put(params).promise();

  return Item;
};
const getCartById = async (id) => {
  const params = {
    TableName,
    Key: {
      id,
    },
  };
  const { Item: cart } = await docClient.get(params).promise();

  return cart;
};

const getCartByUserToken = async (userToken) => {
  const params = {
    TableName,
    FilterExpression: "#userToken = :userToken",
    ExpressionAttributeNames: {
      "#userToken": "userToken",
    },
    ExpressionAttributeValues: {
      ":userToken": userToken,
    },
  };

  const { Items } = await docClient.scan(params).promise();

  return Items.length === 1 ? Items[0] : null;
};

const updateCart = async (cart) => {
  const { id } = cart;
  const params = {
    TableName,
    Key: {
      id,
    },
    UpdateExpression:
      "set #userToken = :userToken, #currency = :currency, #items = :items, #totalItems= :totalItems, #isEmpty = :isEmpty, #subTotal = :subTotal, #attributes = :attributes, #updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#currency": "currency",
      "#userToken": "userToken",
      "#items": "items",
      "#totalItems": "totalItems",
      "#isEmpty": "isEmpty",
      "#subTotal": "subTotal",
      "#attributes": "attributes",
      "#updatedAt": "updatedAt",
    },
    ExpressionAttributeValues: {
      ":currency": cart.currency,
      ":userToken": cart.userToken,
      ":items": cart.items,
      ":totalItems": cart.totalItems,
      ":isEmpty": cart.isEmpty,
      ":subTotal": cart.subTotal,
      ":attributes": cart.attributes,
      ":updatedAt": new Date().toISOString(),
    },
    ReturnValues: "ALL_NEW",
  };


  console.log(params)
  const { Attributes: updatedCart } = await docClient.update(params).promise();

  return updatedCart;
};

const CartRepository = {
  getCartById,
  getCartByUserToken,
  updateCart,
  createNewCart,
};

export default CartRepository;
