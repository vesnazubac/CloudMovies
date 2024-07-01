import json
import boto3

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        user_pool_id = body['poolId']
        username = body['userName']
        group_name = body['group_name']

        client = boto3.client('cognito-idp')

        response = client.admin_add_user_to_group(
            UserPoolId=user_pool_id,
            Username=username,
            GroupName=group_name
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "POST,OPTIONS"
            },
            'body': json.dumps('User added to group successfully')
        }

    except Exception as e:
        # Vraćanje greške ako dođe do problema
        return {
            'statusCode': 500,
            'body': json.dumps(str(e)),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            }
        }
