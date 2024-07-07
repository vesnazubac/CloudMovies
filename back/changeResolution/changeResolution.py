import json
import subprocess
import os
import logging
import uuid
import boto3

s3_client = boto3.client('s3')
s3_resource = boto3.resource('s3')

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
        target_resolution = body.get('target_resolution')

        # Validate required fields
        if not id_filma:
            raise ValueError("Missing required fields")
        bucket_name = os.environ['BUCKET_NAME']

        resolutions = {
        720: 1080,
        480: 720,
        360: 480
        }
        
        if target_resolution not in resolutions:
            resolution = [-1, target_resolution]
        else:
            resolution = [resolutions[target_resolution], target_resolution]

        output_prefix = f"{id_filma}/"
        

        download_dir = '/tmp'
        os.makedirs(download_dir, exist_ok=True)

        download_path = os.path.join(download_dir, file_name)
        s3_client.download_file(bucket_name, id_filma, download_path)

        output_path = f'/tmp/{resolution[1]}.{file_type}'

        cmd = f'ffmpeg -y -i {download_path} -vf "scale={resolution[0]}:{resolution[1]}" -c:a copy {output_path}'
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

        if result.returncode != 0:
            return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Error getting video information with ffprobe','message': f'{result.stderr}', 'path':download_path,
                                'output':output_path}),
        
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }
        
        transcoded_key = f'{output_prefix}{resolution[1]}.{file_type}'
        logger.info(f"output_path: {output_path}")
        logger.info(f"bucket: {bucket_name}")
        logger.info(f"transcoded_key: {transcoded_key}")

        # # Use s3.put_object to upload the file
        with open(output_path, "rb") as f:
            s3_client.put_object(Bucket=bucket_name, Key=transcoded_key, Body=f)
            logger.info(f"File uploaded to S3 at {transcoded_key}")

        # os.remove(download_path)
        # os.remove(output_path)

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Movie data changed successfully','download_path':download_path,'output_prefix':output_prefix,'resolution':resolution,
                                'transcoded_key':transcoded_key,'cmd':cmd,'result_out':result.stdout,'result_err':result.stderr}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }

    except Exception as e:
        print(f"An error occurred: {e}")
      
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