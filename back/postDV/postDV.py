import json
import os
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime

dynamodb = boto3.resource('dynamodb')

table_name = os.environ['DV_TABLE_NAME']
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    body = json.loads(event['body'])
    username = body['username']
    type = body['type']
    naslov = body['naslov']
    timestamp = datetime.now().isoformat()
    id_filma = body['id_filma']


    item = {
        'username': username,
        'type': type,
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
