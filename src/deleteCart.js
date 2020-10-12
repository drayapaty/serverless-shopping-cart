import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const region = process.env.AWS_REGION;
const TableName = process.env.TABLE_NAME;

AWS.config.update({
  region,
});

const docClient = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  console.log("===== deleteCart.handler ======");

  const { input } = event.arguments;

  const Item = {
    id: uuidv4(),
    ...input,
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
