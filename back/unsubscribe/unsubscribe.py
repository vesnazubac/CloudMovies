import boto3
import json

# Inicijalizacija SNS klijenta
sns_client = boto3.client('sns')

def lambda_handler(event, context):
    # Dobivanje email adrese i imena topica iz ulaznih podataka
    body = json.loads(event['body'])
    email = body['email']
    topic = body['topic'].replace(" ","")
    
    try:
        # Dohvatanje ARN-a pretplatnika preko email adrese
        response = sns_client.list_subscriptions()
        
        # Pronalaženje pretplate za određenog korisnika i odgovarajući topic ARN
        subscription_arn = None
        for sub in response['Subscriptions']:
            if sub['Endpoint'] == email and topic in sub['TopicArn']:
                subscription_arn = sub['SubscriptionArn']
                break
        
        # Ako nije pronađena pretplata, vraćamo grešku
        if not subscription_arn:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Subscription not found for the specified email and topic'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    'Access-Control-Allow-Methods': "POST,OPTIONS",
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                }
            }
        
        # Odjavljivanje korisnika sa teme
        sns_client.unsubscribe(
            SubscriptionArn=subscription_arn
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': f'User {email} successfully unsubscribed from topic {topic}'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "POST,OPTIONS",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Failed to unsubscribe user: {str(e)}'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "POST,OPTIONS",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }
