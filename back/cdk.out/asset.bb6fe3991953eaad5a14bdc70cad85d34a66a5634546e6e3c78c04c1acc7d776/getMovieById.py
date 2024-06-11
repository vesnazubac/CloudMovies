# # import json
# # import boto3
# # import os

# # dynamodb = boto3.resource('dynamodb')
# # s3 = boto3.client('s3')

# # def lambda_handler(event, context):
# #     try:
# #         # Extract movie ID from query parameters
# #         movie_id = event['queryStringParameters']['id_filma']
        
# #         # Validate required fields
# #         if not movie_id:
# #             raise ValueError("Missing required field: id_filma")

# #         # DynamoDB: Get movie data
# #         table = dynamodb.Table("TabelaFilmova")
# #         response = table.get_item(
# #             Key={'id_filma': movie_id}
# #         )

# #         if 'Item' not in response:
# #             raise ValueError("Movie not found")

# #         # S3: Get movie URL
# #         bucket_name = os.environ['BUCKET_NAME']
# #         movie_url = s3.generate_presigned_url(
# #             'get_object',
# #             Params={
# #                 'Bucket': bucket_name,
# #                 'Key': f"{movie_id}.mp4"
# #             },
# #             ExpiresIn=3600  # URL valid for 1 hour
# #         )

# #         return {
# #             'statusCode': 200,
# #             'body': json.dumps({
# #                 'movie_data': response['Item'],
# #                 'movie_url': movie_url
# #             })
# #         }
# #     except Exception as e:
# #         # Log error
# #         print(f"An error occurred: {e}")
# #         # Return error response
# #         return {
# #             'statusCode': 500,
# #             'body': json.dumps({'error': str(e)})
# #         }


# import json
# import boto3
# import os

# dynamodb = boto3.resource('dynamodb')
# s3 = boto3.client('s3')

# def lambda_handler(event, context):
#     try:
#         # Log the entire event for debugging
#         print(f"Received event: {json.dumps(event)}")

#         # Extract movie ID from query parameters
#         query_params = event.get('queryStringParameters')
#         if not query_params or 'id_filma' not in query_params:
#             raise ValueError("Missing required query parameter: id_filma")

#         movie_id = query_params['id_filma']
#         naslov=query_params['naslov']
        
#         # Validate required fields
#         if not movie_id:
#             raise ValueError("Missing required field: id_filma")

#         # Log movie_id for debugging
#         print(f"movie_id: {movie_id}")

#         # DynamoDB: Get movie data
#        # Ime tabele
#         table_name = 'TabelaFilmova'
    
#     # Referenca na DynamoDB tabelu
#         table = dynamodb.Table(table_name)
#         # response = table.get_item(
#         #     Key={'id_filma': movie_id}
#         # )
#         response = table.get_item(Key={'id_filma': movie_id, 'naslov': naslov})

#         # Log response for debugging
#         print(f"DynamoDB response: {response}")

#         if 'Item' not in response:
#             raise ValueError("Movie not found")

#         # S3: Get movie URL
#         bucket_name = os.environ['BUCKET_NAME']
#         movie_url = s3.generate_presigned_url(
#             'get_object',
#             Params={
#                 'Bucket': bucket_name,
#                 'Key': f"{movie_id}.mp4"
#             },
#             ExpiresIn=3600  # URL valid for 1 hour
#         )

#         return {
#             'statusCode': 200,
#             'body': json.dumps({
#                 'movie_data': response['Item'],
#                 'movie_url': movie_url
#             })
#         }
#     except Exception as e:
#         # Log error
#         print(f"An error occurred: {e}")
#         # Return error response
#         return {
#             'statusCode': 500,
#             'body': json.dumps({'error': str(e)})
#         }

import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Log the entire event for debugging
        print(f"Received event: {json.dumps(event)}")

        # Extract movie ID and title from query parameters
        query_params = event.get('queryStringParameters')
        if not query_params or 'id_filma' not in query_params or 'naslov' not in query_params:
            raise ValueError("Missing required query parameters: id_filma and naslov")

        movie_id = query_params['id_filma']
        naslov = query_params['naslov']
        
        # Validate required fields
        if not movie_id or not naslov:
            raise ValueError("Missing required fields: id_filma or naslov")

        # Log movie_id and naslov for debugging
        print(f"movie_id: {movie_id}, naslov: {naslov}")

        # DynamoDB: Get movie data
        table = dynamodb.Table("TabelaFilmova")
        response = table.get_item(
            Key={'id_filma': movie_id, 'naslov': naslov}
        )

        # Log response for debugging
        print(f"DynamoDB response: {response}")

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
