import json
import os
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
# table_name = os.environ['FeedRecordsTable']
table_name = os.environ['FEED_RECORDS_TABLE_NAME']
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    body = json.loads(event['body'])
    username = body['username']
    type = body['type']
    content = body['content']
    # movie = body['movie']
    naslov = body['naslov']
    # Generišemo timestamp u ISO 8601 formatu
    timestamp = datetime.now().isoformat()
    id_filma = body['id_filma']

    if(type=='rate'): #pamti se samo poslednja ocena koju je korisnik ostavio

        response = table.query(
            KeyConditionExpression=Key('id_filma').eq(id_filma) & 
                                Key('username').eq(username)
        )

        # Ako postoji takav zapis, obriši ga
        for item in response['Items']:
            table.delete_item(
                Key={
                    'id_filma': item['id_filma'],
                    'username': item['username']
                }
            )

    item = {
        'username': username,
        'type': type,
        'content': content,
        'naslov': naslov,
        'timestamp': timestamp ,
        'id_filma':id_filma
    }

    table.put_item(Item=item)

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Record inserted successfully!'}),
        'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
    }
