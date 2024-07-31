import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { validateAsSpaceEntry } from "../shared/Validator";
import { parseJSON } from "../shared/Utils";

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    
    const randomId = v4();
    const item = parseJSON(event.body);
    item.id = randomId;
    validateAsSpaceEntry(item);

    console.log(`TableName (postSpaces.ts): ${process.env.TABLE_NAME}`)

    const result = await ddbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item)
        // Item: {
        //     id: {
        //         S: randomId
        //     }, 
        //     location: {
        //         S: item.location
        //     }
        // }
    }));
    console.log(result);
    
    return {
        statusCode: 201,
        body: JSON.stringify({id: randomId})
    }
}