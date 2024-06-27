import json
import os
import boto3

cognito_client = boto3.client('cognito-idp')

def lambda_handler(event, context):
    try:
        # Dobijamo informacije o korisniku iz HTTP zahteva (event)
        body = json.loads(event['body'])
        username = body['username']
        password = body['password']
        email = body['email']
        name = body['firstName']
        surname = body['lastName']
        birthdate = body['birthdate']
        

        # Parametri za registraciju korisnika u Cognito
        response = cognito_client.admin_create_user(
            UserPoolId=os.environ['USER_POOL_ID'],
            Username=username,
            TemporaryPassword=password,
            UserAttributes=[
                {'Name': 'email', 'Value': email},
                {'Name': 'given_name', 'Value': name},
                {'Name': 'family_name', 'Value': surname},
                {'Name': 'birthdate', 'Value': birthdate}
            ],
            ValidationData=[
                {'Name': 'email', 'Value': email},
            ]
        )

        # Return uspeha
        return {
            'statusCode': 200,
            'body': json.dumps('User registered successfully'),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods':"POST,OPTIONS"}
        }
    except Exception as e:
        # Return greške
        # return {
        #     'statusCode': 400,
        #     'body': json.dumps(str(e))
        # }
     # Return greške
        error_message = f"Error registering user: {str(e)}"
        print(error_message)  # Ovde dodajemo ispis greške u CloudWatch logs
        return {
            'statusCode': 400,
            'body': json.dumps(error_message),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "POST,OPTIONS"
            }
        }