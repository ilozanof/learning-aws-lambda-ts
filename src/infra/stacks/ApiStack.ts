
import { Stack, StackProps } from 'aws-cdk-lib'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    lambdaIntegration: LambdaIntegration
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props?: ApiStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'SpacesApi');
        const spacesResource = api.root.addResource('spaces');
        //spacesResource.addMethod('GET', props.helloLambdaIntegration);
        spacesResource.addMethod('GET', props.lambdaIntegration);
        spacesResource.addMethod('POST', props.lambdaIntegration);
        spacesResource.addMethod('PUT', props.lambdaIntegration);
        spacesResource.addMethod('DELETE', props.lambdaIntegration);
    }
}