import boto3
import json

# Inicijalizacija SNS klijenta
sns_client = boto3.client('sns')

def lambda_handler(event, context):
    # Dobivanje email adrese iz inputa
    # email = event['email']

    email = event['queryStringParameters']['email']
    
    
    user_topics = []
    
    try:
        # Dohvaćanje ARN-a pretplatnika preko email adrese
        response = sns_client.list_subscriptions()
        
        # Filtriranje pretplata za određenog korisnika na osnovu email adrese
        user_subscriptions = [sub['TopicArn'] for sub in response['Subscriptions'] if sub['Endpoint'] == email]
        print("Useeer subscriptions : ",user_subscriptions)
        # Dohvaćanje detalja o temama na koje je korisnik pretplaćen
        for topic_arn in user_subscriptions:
            if not "-KOMEDIJA" in topic_arn:
                print("Topic - arn : ",topic_arn)
                response = sns_client.get_topic_attributes(TopicArn=topic_arn)
                topic_details = {
                    'TopicArn': topic_arn,
                    # 'TopicName': response['Attributes']['DisplayName'] 
                }
                user_topics.append(topic_details)
        # print(user_topics)
        
        return {
            'statusCode': 200,
            'body': json.dumps(user_topics),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods':"GET,OPTIONS"
            }
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods':"GET,OPTIONS"
            }
        }
