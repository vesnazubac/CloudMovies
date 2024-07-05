# import json
# import boto3

# # Inicijalizacija SNS klijenta
# sns_client = boto3.client('sns')

# def lambda_handler(event, context):
#     # Dohvatanje korisničkog imena i žanra iz ulaznih podataka
#     genre = event.get('genre')
#     user_id = event.get('username')

#     if not user_id:
#         return {
#             'statusCode': 400,
#             'body': json.dumps({'error': 'Missing username in request payload'})
#         }

#     if not genre:
#         return {
#             'statusCode': 400,
#             'body': json.dumps({'error': 'Missing genre in request payload'})
#         }

#     # Pravimo ARN za SNS temu na osnovu žanra (pretpostavljamo da je genre jedinstveni identifikator za temu)
#     topic_arn = f'arn:aws:sns:{context.invoked_function_arn.split(":")[3]}:{context.invoked_function_arn.split(":")[4]}:{genre}'

#     try:
#         # Pretplata korisnika na SNS temu
#         response = sns_client.subscribe(
#             TopicArn=topic_arn,
#             Protocol='email',  
#             Endpoint=user_id 
#         )
#     except sns_client.exceptions.InvalidParameterException as e:
#         return {
#             'statusCode': 400,
#             'body': json.dumps({'error': f'Failed to subscribe user: {str(e)}'})
#         }
#     except Exception as e:
#         return {
#             'statusCode': 500,
#             'body': json.dumps({'error': f'Failed to subscribe user: {str(e)}'})
#         }

#     # Vraćamo uspešan odgovor
#     return {
#         'statusCode': 200,
#         'body': json.dumps({'message': f'User {user_id} successfully subscribed to topic {genre}.'})
#     }


import json
import boto3

# Inicijalizacija SNS klijenta'
sns_client = boto3.client('sns')

# Definisanje ARN-ova tema
GENRE_TOPIC_ARN = {
    'DRAMA': 'arn:aws:sns:eu-central-1:975050364245:CloudBackMain-DRAMATopicC778FD55-x38ZwYOQ9WFM',
    #'KOMEDIJA': 'arn:aws:sns:eu-central-1:975050364245:CloudBackMain-KOMEDIJATopic12345678-abcd-1234-abcd-1234567890ab',
    # Dodajte ARN-ove za druge žanrove po potrebi
}

def lambda_handler(event, context):
    # Dohvatanje korisničkog imena i žanra iz ulaznih podataka
    body = json.loads(event['body'])
    username = body['username']
    genre = body['genre'].upper()
    # query_params = event.get('queryStringParameters')
    # print(query_params)
    # username = query_params['username']
    # genre = query_params['genre']
    # genre = event.get('genre')
    # user_id = event.get('username')
    print(f"Received request: genre={genre}, username={username}")

    if not username:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing username in request payload'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }

    if not genre:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing genre in request payload'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }

    # Provjera da li je žanr podržan
    if genre not in GENRE_TOPIC_ARN:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Unsupported genre: {genre}'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }

    topic_arn = GENRE_TOPIC_ARN[genre]

    try:
        # Pretplata korisnika na SNS temu
        response = sns_client.subscribe(
            TopicArn=topic_arn,
            Protocol='email',  
            Endpoint=username 
        )
    except sns_client.exceptions.InvalidParameterException as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Failed to subscribe user: {str(e)}'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Failed to subscribe user: {str(e)}'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        }

    # Vraćamo uspešan odgovor
    return {
        'statusCode': 200,
        'body': json.dumps({'message': f'User {username} successfully subscribed to topic {genre}.'}),
        'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,POST,OPTIONS,PUT",
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
    }
