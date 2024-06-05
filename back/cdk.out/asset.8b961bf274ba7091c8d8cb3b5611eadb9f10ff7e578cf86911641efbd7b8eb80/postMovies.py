# postMovies/lambda_function.py

import json
import boto3
import os


    
#ubaci s3
def lambda_handler(event, context):
    
    dynamodb = boto3.resource('dynamodb')
    table_name = 'TabelaFilmova'
    
    # Referenca na DynamoDB tabelu
    table = dynamodb.Table(table_name)
    body = json.loads(event['body'])
    id_filma = body['id_filma']
    naslov = body['naslov']
    trajanje=body['trajanje']
    zanr=body['zanr']
    rezolucija=body['rezolucija']
    opis=body['opis']
    
    table.put_item(
        Item={
            'id_filma': id_filma,
            'naslov': naslov,
            'trajanje':trajanje,
            'zanr':zanr,
            'rezolucija':rezolucija,
            'opis':opis
        }
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Movie data added successfully'})
    }