# # # # postMovies/lambda_function.py

# # # import json
# # # import boto3
# # # import os


    
# # # #ubaci s3
# # # def lambda_handler(event, context):

# # #     dynamodb = boto3.resource('dynamodb')
# # #     table_name = 'TabelaFilmova'
    
# # #     # Referenca na DynamoDB tabelu
# # #     table = dynamodb.Table(table_name)
# # #     body = json.loads(event['body'])
# # #     id_filma = body['id_filma']
# # #     naslov = body['naslov']
# # #     trajanje=body['trajanje']
# # #     zanr=body['zanr']
# # #     rezolucija=body['rezolucija']
# # #     opis=body['opis']
    
# # #     table.put_item(
# # #         Item={
# # #             'id_filma': id_filma,
# # #             'naslov': naslov,
# # #             'trajanje':trajanje,
# # #             'zanr':zanr,
# # #             'rezolucija':rezolucija,
# # #             'opis':opis
# # #         }
# # #     )
    
# # #     return {
# # #         'statusCode': 200,
# # #         'body': json.dumps({'message': 'Movie data added successfully'})
# # #     }


# # # postMovies/lambda_function.py

# # import json
# # import boto3
# # import os
# # import base64

# # dynamodb = boto3.resource('dynamodb')
# # #table = dynamodb.Table(os.environ['TABLE_NAME'])
# # s3_client = boto3.resource('s3')

# # def lambda_handler(event, context):

# #     dynamodb = boto3.resource('dynamodb')
# #     table_name = 'TabelaFilmova'
    
# # #     # Referenca na DynamoDB tabelu
# #     table = dynamodb.Table(table_name)
# #     body = json.loads(event['body'])
    
# #     id_filma = body['id_filma']
# #     naslov = body['naslov']
# #     trajanje = body['trajanje']
# #     zanr = body['zanr']
# #     rezolucija = body['rezolucija']
# #     opis = body['opis']
# #     video_data = body['video_data']  # Base64 enkodiran video

# #     # Snimanje podataka u DynamoDB
# #     table.put_item(
# #         Item={
# #             'id_filma': id_filma,
# #             'naslov': naslov,
# #             'trajanje': trajanje,
# #             'zanr': zanr,
# #             'rezolucija': rezolucija,
# #             'opis': opis
# #         }
# #     )
# # #     s3_client = boto3.client('s3')
# # #   #  bucket = s3_client.Bucket("MoviesBucket")
# # #     # Dekodiranje i snimanje video datoteke u S3
# #     s3 = boto3.resource('s3')
# #     bucket_name = 'MoviesBucket'
        
# #     #     # Referenca na DynamoDB tabelu
# #     bucket = s3.Bucket(bucket_name)
# #     video_binary = base64.b64decode(video_data)
# #     bucket.put_object(
# #         Bucket="MoviesBucket",
# #         Key=f"{id_filma}.mp4",
# #         Body=video_binary,
# #         ContentType='video/mp4'
# #     )
    
# #     return {
# #         'statusCode': 200,
# #         'body': json.dumps({'message': 'Movie data added successfully'})
# #     }


# import json
# import boto3
# import base64

# dynamodb = boto3.resource('dynamodb')
# s3 = boto3.resource('s3')

# def lambda_handler(event, context):
#     try:
#         # Load request body
#         body = json.loads(event['body'])
        
#         # Extract movie data
#         id_filma = body.get('id_filma')
#         naslov = body.get('naslov')
#         trajanje = body.get('trajanje')
#         zanr = body.get('zanr')
#         rezolucija = body.get('rezolucija')
#         opis = body.get('opis')
#         video_data = body.get('video_data')  # Base64 encoded video
        
#         # Validate required fields
#         if not id_filma or not naslov or not video_data:
#             raise ValueError("Missing required fields")
        
#         # DynamoDB: Add movie data
#         table = dynamodb.Table('TabelaFilmova')
#         table.put_item(
#             Item={
#                 'id_filma': id_filma,
#                 'naslov': naslov,
#                 'trajanje': trajanje,
#                 'zanr': zanr,
#                 'rezolucija': rezolucija,
#                 'opis': opis
#             }
#         )
        
#         # S3: Upload video file
#         # bucket_name = 'moviesbucket'
#         # bucket = s3.Bucket("cloudbackmain-moviesbucket19abdbbf-3zez3yp7dnyx")
#         s3_client=boto3.client('s3')
#        # bucket=s3.Bucket(bucket_name)
#         video_binary = base64.b64decode(video_data)
#         # bucket.put_object(
#         #     bucket_name,
#         #     Key=f"{id_filma}.mp4",
#         #     Body=video_binary,
#         #     ContentType='video/mp4'
#         # )
#         s3_client.put_object(
#         Bucket="moviesbucket",
#         Key=f"{id_filma}.mp4",
#         Body=video_binary,
#         ContentType='video/mp4'
#         )

        
#         return {
#             'statusCode': 200,
#             'body': json.dumps({'message': 'Movie data added successfully'})
#         }
#     except Exception as e:
#         # Log error
#         print(f"An error occurred: {e}")
#         # Return error response
#         return {
#             'statusCode': 500,
#             'body': json.dumps({'error': str(e)})
#         }






















# import json
# import boto3
# import base64
# import os

# dynamodb = boto3.resource('dynamodb')
# s3 = boto3.client('s3')

# def lambda_handler(event, context):
#     try:
#         # Load request body
#         body = json.loads(event['body'])
        
#         # Extract movie data
#         id_filma = body.get('id_filma')
#         naslov = body.get('naslov')
#         trajanje = body.get('trajanje')
#         zanr = body.get('zanr')
#         rezolucija = body.get('rezolucija')
#         opis = body.get('opis')
#         video_data = body.get('video_data')  # Base64 encoded video
        
#         # Validate required fields
#         if not id_filma or not naslov or not video_data:
#             raise ValueError("Missing required fields")
        
#         # DynamoDB: Add movie data
#         table = dynamodb.Table(os.environ['TABLE_NAME'])
#         table.put_item(
#             Item={
#                 'id_filma': id_filma,
#                 'naslov': naslov,
#                 'trajanje': trajanje,
#                 'zanr': zanr,
#                 'rezolucija': rezolucija,
#                 'opis': opis
#             }
#         )
        
#         # S3: Upload video file
#         bucket_name = os.environ['BUCKET_NAME']
#         video_binary = base64.b64decode(video_data)
#         s3.put_object(
#             Bucket=bucket_name,
#             Key=f"{id_filma}.mp4",
#             Body=video_binary,
#             ContentType='video/mp4'
#         )

#         return {
#             'statusCode': 200,
#             'body': json.dumps({'message': 'Movie data added successfully'})
#         }
#     except Exception as e:
#         # Log error
#         print(f"An error occurred: {e}")
#         # Return error response
#         return {
#             'statusCode': 500,
#             'body': json.dumps({'error': str(e)})
#         }








# import json
# import boto3
# import base64
# import os
# import uuid
# from moviepy.editor import VideoFileClip

# dynamodb = boto3.resource('dynamodb')
# s3 = boto3.client('s3')

# def lambda_handler(event, context):
#     try:
#         # Load request body
#         body = json.loads(event['body'])
        
#         # Extract movie data
#         id_filma = str(uuid.uuid4())  # Generate unique movie ID
#         naslov = body.get('naslov')
#         zanr = body.get('zanr')
#         rezolucija = body.get('rezolucija')
#         opis = body.get('opis')
#         video_data = body.get('video_data')  # Base64 encoded video

#         # Validate required fields
#         if not naslov or not video_data:
#             raise ValueError("Missing required fields: naslov and video_data")

#         # Decode video data and save it to a temporary file
#         video_binary = base64.b64decode(video_data)
#         temp_file_path = f"/tmp/{id_filma}.mp4"
#         with open(temp_file_path, 'wb') as video_file:
#             video_file.write(video_binary)

#         # Calculate video duration
#         video_clip = VideoFileClip(temp_file_path)
#         trajanje = int(video_clip.duration)
#         video_clip.close()  # Close the VideoFileClip to release the file

#         # DynamoDB: Add movie data
#         table = dynamodb.Table(os.environ['TABLE_NAME'])
#         table.put_item(
#             Item={
#                 'id_filma': id_filma,
#                 'naslov': naslov,
#                 'trajanje': trajanje,
#                 'zanr': zanr,
#                 'rezolucija': rezolucija,
#                 'opis': opis
#             }
#         )

#         # S3: Upload video file
#         bucket_name = os.environ['BUCKET_NAME']
#         s3.put_object(
#             Bucket=bucket_name,
#             Key=f"{id_filma}.mp4",
#             Body=video_binary,
#             ContentType='video/mp4'
#         )

#         return {
#             'statusCode': 200,
#             'body': json.dumps({'message': 'Movie data added successfully', 'id_filma': id_filma})
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
import base64
import os
import uuid
import ffmpeg

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Load request body
        body = json.loads(event['body'])
        
        # Extract movie data
        id_filma = str(uuid.uuid4())  # Generate unique movie ID
        naslov = body.get('naslov')
        zanr = body.get('zanr')
        rezolucija = body.get('rezolucija')
        opis = body.get('opis')
        video_data = body.get('video_data')  # Base64 encoded video

        # Validate required fields
        if not naslov or not video_data:
            raise ValueError("Missing required fields: naslov and video_data")

        # Decode video data and save it to a temporary file
        video_binary = base64.b64decode(video_data)
        temp_file_path = f"/tmp/{id_filma}.mp4"
        with open(temp_file_path, 'wb') as video_file:
            video_file.write(video_binary)

        # Calculate video duration using ffmpeg
        probe = ffmpeg.probe(temp_file_path)
        duration = float(probe['format']['duration'])

        # DynamoDB: Add movie data
        table = dynamodb.Table(os.environ['TABLE_NAME'])
        table.put_item(
            Item={
                'id_filma': id_filma,
                'naslov': naslov,
                'trajanje': int(duration),
                'zanr': zanr,
                'rezolucija': rezolucija,
                'opis': opis
            }
        )

        # S3: Upload video file
        bucket_name = os.environ['BUCKET_NAME']
        s3.put_object(
            Bucket=bucket_name,
            Key=f"{id_filma}.mp4",
            Body=video_binary,
            ContentType='video/mp4'
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Movie data added successfully', 'id_filma': id_filma})
        }
    except Exception as e:
        # Log error
        print(f"An error occurred: {e}")
        # Return error response
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
