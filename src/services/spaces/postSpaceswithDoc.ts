import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

export async function postSpacesWithDoc(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    
    const ddDocClient = DynamoDBDocumentClient.from(ddbClient);

    const randomId = v4();
    const item = JSON.parse(event.body);

    console.log(`TableName (postSpaces.ts): ${process.env.TABLE_NAME}`)

    const result = await ddDocClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: item
    }));
    console.log(result);
    
    return {
        statusCode: 201,
        body: JSON.stringify({id: randomId})
    }
}