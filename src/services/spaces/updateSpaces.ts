import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoProjectionExpression } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

export async function updateSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    
   if (event.queryStringParameters && ('id' in event.queryStringParameters) && (event.body)) {
        const spaceId = event.queryStringParameters['id'];
        const body = JSON.parse(event.body);
        const requestBodyKey = Object.keys(body)[0];
        const requestBodyValue = body[requestBodyKey];

        const updateResult = await ddbClient.send(new UpdateItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': {S: spaceId}
            },
            UpdateExpression: 'set #zzzNew = :new',
            ExpressionAttributeValues: {
                ':new': {
                    S: requestBodyValue
                }
            },
            ExpressionAttributeNames: {
                '#zzzNew': requestBodyKey
            },
            ReturnValues: 'UPDATED_NEW'
        }));

        return {
            statusCode: 201,
            body: JSON.stringify(updateResult.Attributes)
        }
   }

   return {
    statusCode: 204,
    body: JSON.stringify('Please provide right args!')
   }
}