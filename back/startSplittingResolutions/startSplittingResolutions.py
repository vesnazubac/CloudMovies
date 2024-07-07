import json
import os
import boto3

client = boto3.client('stepfunctions')

def lambda_handler(event,context):
    state_machine_arn = os.environ['STATE_MACHINE_ARN']
    body = json.loads(event['body'])
    key = body['key']
    input_payload = json.dumps({"key":key})

    response = client.start_execution(
        stateMachineArn=state_machine_arn,
        input=input_payload
    )
    return create_response(200, {'response':response})
def create_response(status, body):
    return {
        'statusCode': status,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        'body': json.dumps(body, default=str)
    }