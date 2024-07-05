import json
import boto3

# Inicijalizacija SNS klijenta'
sns_client = boto3.client('sns')

def lambda_handler(event, context):
    # Dohvatanje korisničkog imena i žanra iz ulaznih podataka
    body = json.loads(event['body'])
    username = body['username']
    director = body['director'].upper().replace(" ", "")

    
    print(f"Received request: director={director}, username={username}")

    if not username:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing username in request payload'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }

    if not director:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing genre in request payload'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }

    topic_arn=""

    topics=sns_client.list_topics()
    for topic in topics['Topics']:
        if director in topic['TopicArn']:
            topic_arn=topic['TopicArn']

    if topic_arn=="":
        response=sns_client.create_topic(Name=director)
        topic_arn=response['TopicArn']


    try:
        # Pretplata korisnika na SNS temu
        response = sns_client.subscribe(
            TopicArn=topic_arn,
            Protocol='email',  
            Endpoint=username 
        )
    except sns_client.exceptions.InvalidParameterException as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Failed to subscribe user: {str(e)}'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Failed to subscribe user: {str(e)}'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }

    # Vraćamo uspešan odgovor
    return {
        'statusCode': 200,
        'body': json.dumps({'message': f'User {username} successfully subscribed to topic {director}.'}),
        'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
    }
