import json
import os
import boto3
from botocore.exceptions import ClientError

cognito_client = boto3.client('cognito-idp')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        username = body['username']
        password = body['password']

        # Autentifikacija korisnika koristeći Cognito User Pool
        auth_response = cognito_client.admin_initiate_auth(
            UserPoolId=os.environ['USER_POOL_ID'],
            ClientId="3hki13te6ivmhsmknoc5gn0rpr",
            AuthFlow='ADMIN_USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password
            }
        )

        # Ako je autentifikacija uspešna, vratimo korisniku ID sesije ili neke druge korisne podatke
        return {
            'statusCode': 200,
            'body': json.dumps(auth_response)
        }

    except ClientError as e:
        # Vraćamo specifičnu grešku ako autentifikacija nije uspela
        error_message = e.response['Error']['Message']
        return {
            'statusCode': 401,
            'body': json.dumps({'error': error_message})
        }
