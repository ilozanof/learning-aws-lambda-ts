import { App } from "aws-cdk-lib"
import { MonitorStack } from "../../src/infra/stacks/MonitorStack";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";
import { Handler, Runtime } from "aws-cdk-lib/aws-lambda";


describe('Monitor Test Suite', () => {

    let monitorStackTemplate: Template;

    beforeAll(() => {
        const testApp = new App({
            outdir: 'cdk.out'
        });

        const monitorStack = new MonitorStack(testApp, 'MonitorStack');
        monitorStackTemplate = Template.fromStack(monitorStack);
    })

    test('template test - Lambda topic', () => {
        monitorStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
            Handler: 'index.handler',
            Runtime: 'nodejs18.x'
        });
    })

    test('template test - SNS Topic', () => {
        monitorStackTemplate.hasResourceProperties('AWS::SNS::Topic', {
            DisplayName: 'AlarmTopic',
            TopicName: 'AlarmTopic'
        });
    })

    test('template test - SNS Subscription', () => {
        monitorStackTemplate.hasResourceProperties('AWS::SNS::Subscription', 
            Match.objectEquals(
            {
                Protocol: 'lambda',
                TopicArn: {
                    Ref: Match.stringLikeRegexp('AlarmTopic')
                },
                Endpoint: {
                    'Fn::GetAtt': [
                        Match.stringLikeRegexp('webHookLambda'),
                        'Arn'
                    ]
                }          
            })
    );
    })

    test('template test - SNS Subscription - exact values', () => {
        const snsTopic = monitorStackTemplate.findResources('AWS::SNS::Topic');
        const snsTopicName = Object.keys(snsTopic)[0];

        const snsLambda = monitorStackTemplate.findResources('AWS::Lambda::Function');
        const snsLambdaName = Object.keys(snsLambda)[0];
        
        console.log(snsTopicName);
        console.log(snsLambdaName);

        monitorStackTemplate.hasResourceProperties('AWS::SNS::Subscription', 
            {
                Protocol: 'lambda',
                TopicArn: {
                    Ref: snsTopicName
                },
                Endpoint: {
                    'Fn::GetAtt': [
                        snsLambdaName,
                        'Arn'
                    ]
                }          
            }
        )
    });

    test('Alarm actions', () => {
        const alarmActionsCapture = new Capture();
        monitorStackTemplate.hasResourceProperties('AWS::CloudWatch::Alarm', {
            AlarmActions: alarmActionsCapture
        })

        expect(alarmActionsCapture.asArray()).toEqual([{
            Ref: expect.stringMatching(/^AlarmTopic/)
        }])
    })

    test('MonitorStack snapshot', () => {
        const lambda = monitorStackTemplate.findResources('AWS::Lambda::Function');
        expect(monitorStackTemplate.toJSON()).toMatchSnapshot();
        // smaller scoped check:
        expect(lambda).toMatchSnapshot();
    })

})