import json
import boto3
import base64
import os
import uuid
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Load request body
        body = json.loads(event['body'])
        
        # Extract movie data
        #id_filma = body.get('id_filma')
        id_filma=str(uuid.uuid4())
        naslov = body.get('naslov')
        trajanje = body.get('trajanje')
        zanr = body.get('zanr')
        rezolucija = body.get('rezolucija')
        opis = body.get('opis')
        glumci = body.get('glumci')
        reziser = body.get('reziser')
        video_data = body.get('video_data')  # Base64 encoded video
        
        # Validate required fields
        if not id_filma or not naslov or not video_data:
            raise ValueError("Missing required fields")
        
        # DynamoDB: Add movie data
        table = dynamodb.Table(os.environ['TABLE_NAME'])
        table.put_item(
            Item={
                'id_filma': id_filma,
                'naslov': naslov,
                'trajanje': trajanje,
                'zanr': zanr,
                'rezolucija': rezolucija,
                'glumci': glumci,
                'reziser': reziser,
                'opis': opis,
                'combined_key':f"{naslov}|{glumci}|{opis}|{reziser}|{zanr}"
            }
        )
        
        # S3: Upload video file
        bucket_name = os.environ['BUCKET_NAME']
        video_binary = base64.b64decode(video_data)
        s3.put_object(
            Bucket=bucket_name,
            Key=f"{id_filma}.mp4",
            Body=video_binary,
            ContentType='video/mp4'
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Movie data added successfully'})
        }
    except Exception as e:
        # Log error
        print(f"An error occurred: {e}")
        # Return error response
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
