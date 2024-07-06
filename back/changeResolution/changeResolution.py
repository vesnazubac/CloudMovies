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
        id_filma = body.get('id_filma') # ujedno i file_name
        file_type = body.get('file_type')
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
        # s3_source_key = 'input.mp3' # Update your s3 object file name here

        download_path = f'/tmp/{id_filma}'
        s3_resource.Bucket(bucket_name).download_file(id_filma, download_path)
    
        print('Audio File Info')
        subprocess.call(['ffmpeg', '-i', f'/tmp/{id_filma}'])
    
        return {
            'statusCode': 200,
            'body': json.dumps('FFMPEG File Info Fetched')
        }
        # if target_resolution not in resolutions:
        #     resolution = [-1, target_resolution]
        # else:
        #     resolution = [resolutions[target_resolution], target_resolution]

        # output_prefix = f"{id_filma}/"
        

        # download_dir = '/tmp'
        # os.makedirs(download_dir, exist_ok=True)

        # download_path = os.path.join(download_dir, f"{id_filma}.{file_type}")
        # s3.download_file(bucket_name, id_filma, download_path)

        # output_path = f'/tmp/{resolution[1]}.{file_type}'

        # cmd = f'/opt/bin/ffmpeg -i {download_path} -vf "scale={resolution[0]}:{resolution[1]}" -c:a copy {output_path}'
        # result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

        # if result.returncode != 0:
        #     logger.error(f"FFmpeg error: {result.stderr}")
        #     raise RuntimeError(f"FFmpeg error: {result.stderr}")

        
        # transcoded_key = f'{output_prefix}{resolution[1]}.{file_type}'
        # logger.info(f"output_path: {output_path}")
        # logger.info(f"bucket: {bucket_name}")
        # logger.info(f"transcoded_key: {transcoded_key}")

        # # Use s3.put_object to upload the file
        # with open(output_path, "rb") as f:
        #     s3.put_object(Bucket=bucket_name, Key=transcoded_key, Body=f)
        #     logger.info(f"File uploaded to S3 at {transcoded_key}")

        # os.remove(download_path)
        # os.remove(output_path)

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Movie data changed successfully'}),
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
        