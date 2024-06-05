# # postMovies/lambda_function.py

# import json
# import boto3
# import os


    
# #ubaci s3
# def lambda_handler(event, context):

#     dynamodb = boto3.resource('dynamodb')
#     table_name = 'TabelaFilmova'
    
#     # Referenca na DynamoDB tabelu
#     table = dynamodb.Table(table_name)
#     body = json.loads(event['body'])
#     id_filma = body['id_filma']
#     naslov = body['naslov']
#     trajanje=body['trajanje']
#     zanr=body['zanr']
#     rezolucija=body['rezolucija']
#     opis=body['opis']
    
#     table.put_item(
#         Item={
#             'id_filma': id_filma,
#             'naslov': naslov,
#             'trajanje':trajanje,
#             'zanr':zanr,
#             'rezolucija':rezolucija,
#             'opis':opis
#         }
#     )
    
#     return {
#         'statusCode': 200,
#         'body': json.dumps({'message': 'Movie data added successfully'})
#     }


# postMovies/lambda_function.py

import json
import boto3
import os
import base64

dynamodb = boto3.resource('dynamodb')
#table = dynamodb.Table(os.environ['TABLE_NAME'])
s3_client = boto3.client('s3')

def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')
    table_name = 'TabelaFilmova'
    
#     # Referenca na DynamoDB tabelu
    table = dynamodb.Table(table_name)
    body = json.loads(event['body'])
    
    id_filma = body['id_filma']
    naslov = body['naslov']
    trajanje = body['trajanje']
    zanr = body['zanr']
    rezolucija = body['rezolucija']
    opis = body['opis']
    video_data = body['video_data']  # Base64 enkodiran video

    # Snimanje podataka u DynamoDB
    table.put_item(
        Item={
            'id_filma': id_filma,
            'naslov': naslov,
            'trajanje': trajanje,
            'zanr': zanr,
            'rezolucija': rezolucija,
            'opis': opis
        }
    )
    s3_client = boto3.client('s3')

    # Dekodiranje i snimanje video datoteke u S3
    video_binary = base64.b64decode(video_data)
    s3_client.put_object(
        Bucket="MoviesBucket",
        Key=f"{id_filma}.mp4",
        Body=video_binary,
        ContentType='video/mp4'
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Movie data added successfully'})
    }

