import json
import os
import boto3

client = boto3.client('stepfunctions')

def lambda_handler(event, context):
    state_machine_arn = os.environ['STATE_MACHINE_ARN']
    body = json.loads(event['body'])
    key = body['key']
    input_payload = json.dumps({"key": key})

    response = client.start_execution(
        stateMachineArn=state_machine_arn,
        input=input_payload
    )

    return {
            'statusCode': 200,
            'body': json.dumps(response),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }