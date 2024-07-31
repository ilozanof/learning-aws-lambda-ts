import { App } from 'aws-cdk-lib';
import { DataStack } from './stacks/DataStack';
import { LambdaStack } from './stacks/LambdaStack';
import { ApiStack } from './stacks/ApiStack';
import { LambdaSpacesStack } from './stacks/LambdaSpacesStack';
import { AuthStack } from './stacks/AuthStack';
import { MonitorStack } from './stacks/MonitorStack';

const app = new App();
const dataStack = new DataStack(app, 'DataStack');
const lambdaStack = new LambdaStack(app, 'LambdaStack');

const lambdaSpacesStack = new LambdaSpacesStack(app, 'LambdaSpacesStack', {
    spacesTable: dataStack.spacesTable
});

//const authStack = new AuthStack(app, 'AuthStack');

const apiStack = new ApiStack(app, 'ApiStack', {
    lambdaIntegration: lambdaSpacesStack.lambdaIntegration
});

new MonitorStack(app, 'MonitorStack');


