import { handler } from '../src/services/spaces/handler';

process.env.AWS_REGION = "eu-west-3",
process.env.TABLE_NAME = "SpaceStack-0663a8321d6d"

const response =  handler({
    httpMethod: 'POST',
    // queryStringParameters: {
     //id: '640abc56-39bd-40b9-935a-6e41d6778756'
    // }
    //  ,
      body: JSON.stringify({
          location: "Raices"})
    
} as any, {} as any);
console.log(response.then(response => console.log(response)));