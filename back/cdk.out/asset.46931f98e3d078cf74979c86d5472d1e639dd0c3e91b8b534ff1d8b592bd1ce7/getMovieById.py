import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Extract movie ID from query parameters
        movie_id = event['queryStringParameters']['id_filma']
        
        # Validate required fields
        if not movie_id:
            raise ValueError("Missing required field: id_filma")

        # DynamoDB: Get movie data
        table = dynamodb.Table(os.environ['TABLE_NAME'])
        response = table.get_item(
            Key={'id_filma': movie_id}
        )

        if 'Item' not in response:
            raise ValueError("Movie not found")

        # S3: Get movie URL
        bucket_name = os.environ['BUCKET_NAME']
        movie_url = s3.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': bucket_name,
                'Key': f"{movie_id}.mp4"
            },
            ExpiresIn=3600  # URL valid for 1 hour
        )

        return {
            'statusCode': 200,
            'body': json.dumps({
                'movie_data': response['Item'],
                'movie_url': movie_url
            })
        }
    except Exception as e:
        # Log error
        print(f"An error occurred: {e}")
        # Return error response
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
