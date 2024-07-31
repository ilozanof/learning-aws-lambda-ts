import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoProjectionExpression } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

export async function deleteSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    
   if (event.queryStringParameters && ('id' in event.queryStringParameters)) {
        const spaceId = event.queryStringParameters['id'];
    
        const deleteResult = await ddbClient.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': {S: spaceId}
            }
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(`Deleted space with id ${spaceId}`)
        }
   }

   return {
    statusCode: 204,
    body: JSON.stringify('Please provide right args!')
   }
}