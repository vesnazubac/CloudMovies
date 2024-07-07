import json
import boto3
import os
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['DV_TABLE_NAME']
table = dynamodb.Table(table_name)

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj)  
    raise TypeError

def lambda_handler(event, context):
    
    username = event['queryStringParameters']['username']
    
    response = table.query(
        KeyConditionExpression=Key('username').eq(username),
        ScanIndexForward=False  #u opadajucem redosledu - prvo najskoriji
    )
    
    items = response['Items']
    
    # Konverzija Decimal u int prilikom serijalizacije u JSON
    items = json.dumps(items, default=decimal_default)
    
    return {
        'statusCode': 200,
        'body': items,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
            'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    }


