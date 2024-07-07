import json
import os
import logging
import boto3

sqs_client = boto3.client('sqs')
sqs_queue_url = 'https://sqs.eu-central-1.amazonaws.com/975050364245/MyAWSQueue'

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        # Load request body
        body = json.loads(event['body'])
        
        # Extract movie data
        id_filma = body.get('id_filma')
        file_type = body.get('file_type')
        file_name = body.get('file_name')
        target_resolutions = body.get('target_resolutions', [720, 480, 360])

        # Validate required fields
        if not id_filma:
            raise ValueError("Missing required fields")

        bucket_name = os.environ['BUCKET_NAME']

        for resolution in target_resolutions:
            message_body = {
                'id_filma': id_filma,
                'file_type': file_type,
                'file_name': file_name,
                'resolution': resolution
            }

            # Send message to SQS
            response = sqs_client.send_message(
                QueueUrl=sqs_queue_url,
                MessageBody=json.dumps(message_body)
            )

            logger.info(f"Sent message to SQS for resolution {resolution}: {response['MessageId']}")

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Transcoding jobs submitted to SQS'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }

    except Exception as e:
        logger.error(f"An error occurred: {e}")
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