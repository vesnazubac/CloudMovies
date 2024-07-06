import json
import boto3
import os
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['FEED_RECORDS_TABLE_NAME']
table = dynamodb.Table(table_name)

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj)  
    raise TypeError

def lambda_handler(event, context):
    # Čitanje svih zapisa iz tablice
    response = table.scan()

    # Konverzija Decimal u int prilikom serijalizacije u JSON
    items = response['Items']
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
