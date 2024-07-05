import boto3
import os
import json
import jwt
#import jwt.algorithms

s3_client = boto3.client('s3')
iam = boto3.client('iam')

def lambda_handler(event,context):
    try:
        token=event["authorizationToken"].split()[1]
    except:
        token=event['headers']['Authorization'].split()[1]
    
    user_pool_id=os.environ['USER_POOL_ID']

    jwt_payload = jwt.decode(token, options={"verify_signature": False})

    principal_id = jwt_payload['sub']  #korisnicki(principal) id
    user_groups = jwt_payload.get('cognito:groups', [])  #grupa

    method_arn = event['methodArn']

    if 'Admins' in user_groups:
        if 'subscribe' in method_arn:
            effect='Deny'
        else : 
            effect = 'Allow'
    else:
        if 'subscribe' in method_arn:
            effect='Allow'
        else:
            effect = 'Deny'
    
    policy = generate_policy(principal_id, effect, method_arn)

    return policy

def generate_policy(principal_id, effect, method_arn):
    return {
        'principalId': principal_id,
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [{
                'Action': 'execute-api:Invoke',
                'Effect': effect,
                'Resource': method_arn
            }]
        }
    }
