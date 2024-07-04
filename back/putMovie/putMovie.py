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
        id_filma = body.get('id_filma')
        naslov = body.get('naslov')
        zanr = body.get('zanr')
        opis = body.get('opis')
        glumci = body.get('glumci')
        reziser = body.get('reziser')
        video_data = body.get('video_data')  # Base64 encoded video, optional
        file_type = body.get('file_type')  # Optional
        file_name = body.get('file_name')  # Optional
        file_size = body.get('file_size')  # Optional
        file_modified = body.get('file_modified')  # Optional
        episode = body.get('episode')  # Optional

        # Validate required fields
        if not id_filma or not naslov:
            raise ValueError("Missing required fields")

        bucket_name = os.environ['BUCKET_NAME']
        update_expression = "SET "
        expression_attribute_values = {}
        #if naslov:
         #   update_expression += "naslov = :naslov, "
          #  expression_attribute_values[':naslov'] = naslov
        if zanr:
            update_expression += "zanr = :zanr, "
            expression_attribute_values[':zanr'] = zanr
        if opis:
            update_expression += "opis = :opis, "
            expression_attribute_values[':opis'] = opis
        if glumci:
            update_expression += "glumci = :glumci, "
            expression_attribute_values[':glumci'] = glumci
        if reziser:
            update_expression += "reziser = :reziser, "
            expression_attribute_values[':reziser'] = reziser
        if episode:
            update_expression += "episode = :episode, "
            expression_attribute_values[':episode'] = episode

        if video_data:
            video_binary = base64.b64decode(video_data)
            s3_key = f"{id_filma}.{file_type}"
            s3.put_object(
                Bucket=bucket_name,
                Key=s3_key,
                Body=video_binary,
                ContentType=f'video/{file_type}'
            )
            s3_url = f"https://{bucket_name}.s3.eu-central-1.amazonaws.com/{s3_key}"
            update_expression += "s3_url = :s3_url, file_type = :file_type, file_name = :file_name, file_size = :file_size, file_modified = :file_modified, "
            expression_attribute_values[':s3_url'] = s3_url
            expression_attribute_values[':file_type'] = file_type
            expression_attribute_values[':file_name'] = file_name
            expression_attribute_values[':file_size'] = file_size
            expression_attribute_values[':file_modified'] = file_modified

        if 'combined_key' not in expression_attribute_values:
            combined_key = f"{naslov}|{glumci}|{opis}|{reziser}|{zanr}"
            update_expression += "combined_key = :combined_key, "
            expression_attribute_values[':combined_key'] = combined_key

        # Remove trailing comma and space from update_expression
        update_expression = update_expression.rstrip(', ')

        # DynamoDB: Update movie data
        table = dynamodb.Table(os.environ['TABLE_NAME'])
        response = table.update_item(
            Key={'id_filma': id_filma, 'naslov':naslov},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues="UPDATED_NEW"
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Movie data updated successfully', 'updated_attributes': response['Attributes']}),
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
