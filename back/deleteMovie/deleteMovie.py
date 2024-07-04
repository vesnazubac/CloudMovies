import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Load request body
        body = json.loads(event['body'])
        
        # Extract movie id
        id_filma = body.get('id_filma')
        naslov = body.get('naslov')
        if not id_filma or not naslov:
            return {
            'statusCode': 400,
            'body': json.dumps('Nije prosleđen validan id_filma ili naslov.')
            }
            raise ValueError("Missing required field: id_filma")
        
        # DynamoDB: Get movie data to retrieve the S3 key
        table = dynamodb.Table(os.environ['TABLE_NAME'])
        response = table.get_item(Key={'id_filma': id_filma, 'naslov':naslov})
        
        if 'Item' not in response:
            return {
            'statusCode': 400,
            'body': json.dumps(f"Movie with id_filma {id_filma} does not exist")
            }
            raise ValueError(f"Movie with id_filma {id_filma} does not exist")
        
        item = response['Item']
        s3_key = f"{id_filma}.{item['file_type']}"
        
        # S3: Delete video file
        bucket_name = os.environ['BUCKET_NAME']
        s3.delete_object(
            Bucket=bucket_name,
            Key=s3_key
        )
        
        # DynamoDB: Delete movie data
        table.delete_item(
            Key={'id_filma': id_filma, 'naslov':naslov}
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Movie data deleted successfully'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }
    except Exception as e:
        # Log error
        print(f"An error occurred: {e}")
        # Return error response
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)+str(id_filma)}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }
