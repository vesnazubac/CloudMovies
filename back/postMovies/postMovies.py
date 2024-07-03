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
        id_filma = str(uuid.uuid4())
        naslov = body.get('naslov')
        zanr = body.get('zanr')
        opis = body.get('opis')
        glumci = body.get('glumci')
        reziser = body.get('reziser')
        video_data = body.get('video_data')  # Base64 encoded video
        file_type = body.get('file_type')
        file_name = body.get('file_name')
        file_size = body.get('file_size')
        file_modified = body.get('file_modified')

        # Validate required fields
        if not id_filma or not naslov or not video_data:
            raise ValueError("Missing required fields")
        
        # S3: Upload video file
        bucket_name = os.environ['BUCKET_NAME']
        video_binary = base64.b64decode(video_data)
        s3_key = f"{id_filma}.{file_type}"
        s3.put_object(
            Bucket=bucket_name,
            Key=s3_key,
            Body=video_binary,
            ContentType=f'video/{file_type}'
        )

        # Generate URL for the uploaded file with specific region (eu-central-1)
        s3_url = f"https://{bucket_name}.s3.eu-central-1.amazonaws.com/{s3_key}"
        
        # DynamoDB: Add movie data with S3 URL
        table = dynamodb.Table(os.environ['TABLE_NAME'])
        table.put_item(
            Item={
                'id_filma': id_filma,
                'naslov': naslov,
                'zanr': zanr,
                'glumci': glumci,
                'reziser': reziser,
                'opis': opis,
                'combined_key': f"{naslov}|{glumci}|{opis}|{reziser}|{zanr}",
                'file_type': file_type,
                'file_name': file_name,
                'file_size': file_size,
                'file_modified': file_modified,
                's3_url': s3_url  # Dodajemo novi atribut s3_url
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Movie data added successfully', 'video_url': s3_url}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }
    except Exception as e:
        # Log error
        print(f"An error occurred: {e}")
        # Return error response
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }
