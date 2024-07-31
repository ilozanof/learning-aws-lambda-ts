import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { EventAction } from "aws-cdk-lib/aws-codebuild";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { postSpaces } from "./postSpaces";
import { getSpaces } from "./getSpaces";
import { updateSpaces } from "./updateSpaces";
import { deleteSpaces } from "./deleteSpaces";
import { JsonError, MissingFieldError } from "../shared/Validator";

import { captureAWSv3Client, getSegment } from 'aws-xray-sdk-core'


// We "Capture" calls to our DynamoDB Client
const ddbClient = captureAWSv3Client(new DynamoDBClient({}));

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

   let message: string;


   
   // Integration with AWWS-X-Ray
   // A simulation of a time-consuming call:
   const subSeg = getSegment().addNewSubsegment('MyLongCall');
   await new Promise(resolve  => { setTimeout(resolve, 500)});
   subSeg.close();

   //console.log(`TableName (handler.ts): ${process.env.TABLE_NAME}`)

   try {
      switch (event.httpMethod) {
         case 'GET':
            const getResponse = await getSpaces(event, ddbClient);
            return getResponse;
            break;
   
         case 'POST':
            const postResponse = await postSpaces(event, ddbClient);
            return postResponse;
            break;

         case 'PUT':
            const putResponse = await updateSpaces(event, ddbClient);
            return putResponse;
            break;

         case 'DELETE':
            const deleteResponse = await deleteSpaces(event, ddbClient);
            return deleteResponse;
            break;
      }
   } catch (error) {
      console.error(error);
      if (error instanceof MissingFieldError) {
         return  {
            statusCode: 400,
            body: JSON.stringify(error.message)
         }
      }

      if (error instanceof JsonError) {
         return {
            statusCode: 400,
            body: error.message
         }
      }

      return {
         statusCode: 500,
         body: JSON.stringify(error.message)
      }
   }
   

   const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify(message)
   };

   return response;
}

export { handler }