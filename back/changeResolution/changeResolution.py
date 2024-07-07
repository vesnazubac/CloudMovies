import json
import subprocess
import os
import logging
import boto3

sqs_client = boto3.client('sqs')
s3_client = boto3.client('s3')
s3_resource = boto3.resource('s3')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        # Read messages from SQS
        messages = sqs_client.receive_message(
            QueueUrl='https://sqs.eu-central-1.amazonaws.com/975050364245/MyAWSQueue',
            MaxNumberOfMessages=3,
            VisibilityTimeout=30,
            WaitTimeSeconds=20
        )

        if 'Messages' in messages:
            for message in messages['Messages']:
                # Extract message body
                message_body = json.loads(message['Body'])

                # Extract movie data from message
                id_filma = message_body.get('id_filma')
                file_type = message_body.get('file_type')
                file_name = message_body.get('file_name')
                target_resolution = message_body.get('resolution')

                # Validate required fields
                if not id_filma or not file_type or not file_name or not target_resolution:
                    logger.error(f"Invalid message format: {message_body}")
                    continue

                # Download original video file from S3
                bucket_name = os.environ['BUCKET_NAME']
                download_dir = '/tmp'
                os.makedirs(download_dir, exist_ok=True)
                download_path = os.path.join(download_dir, file_name)
                s3_client.download_file(bucket_name, id_filma, download_path)

                # Transcode video to the target resolution
                resolutions = {
                    720: '1080p',
                    480: '720p',
                    360: '480p'
                }
                output_prefix = f"{id_filma}/"
                output_path = f'/tmp/{resolutions[target_resolution]}.{file_type}'

                cmd = f'ffmpeg -y -i {download_path} -vf "scale={target_resolution}:trunc(ow/a/2)*2" -c:a copy {output_path}'
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

                if result.returncode != 0:
                    logger.error(f"Error transcoding video: {result.stderr}")
                    continue

                # Upload transcoded video to S3
                transcoded_key = f'{output_prefix}{resolutions[target_resolution]}.{file_type}'
                with open(output_path, "rb") as f:
                    s3_client.put_object(Bucket=bucket_name, Key=transcoded_key, Body=f)
                    logger.info(f"Transcoded video uploaded to S3: {transcoded_key}")

                # Clean up temporary files
                os.remove(download_path)
                os.remove(output_path)

                # Delete message from SQS queue
                sqs_client.delete_message(
                    QueueUrl='https://sqs.eu-central-1.amazonaws.com/975050364245/MyAWSQueue',
                    ReceiptHandle=message['ReceiptHandle']
                )
                logger.info(f"Processed and deleted message from SQS: {message['MessageId']}")

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Transcoding process completed'}),
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
