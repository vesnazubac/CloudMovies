import json
import boto3
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table_name = 'SearchMoviesTable'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # Log the entire event for debugging
        print(f"Received event: {json.dumps(event)}")

        # Extract query parameters
        query_params = event.get('queryStringParameters', {})
        
        # Define possible query parameters
        naslov = query_params.get('naslov', '').lower()
        opis = query_params.get('opis', '').lower()
        glumci = query_params.get('glumci', '').lower()
        reziser = query_params.get('reziser', '').lower()
        zanr = query_params.get('zanr', '').lower()

        # Build the filter expression dynamically
        filter_expression = None

        response = table.scan()
        items = response.get('Items', [])

        # Filter items based on query parameters
        filtered_items = []
        for item in items:
            movie_data = item['movie_data'].lower()
            movie_parts = movie_data.split('|')
            
            if (naslov in movie_parts[0] and
                glumci in movie_parts[1] and
                opis in movie_parts[2] and
                reziser in movie_parts[3] and
                zanr in movie_parts[6]):
                filtered_items.append(item)

        return {
            'statusCode': 200,
            'body': json.dumps(filtered_items),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods':"GET,OPTIONS"
            }}

        if naslov:
            filter_expression = Attr('naslov').contains(naslov)
        
        if opis:
            if filter_expression:
                filter_expression &= Attr('opis').contains(opis)
            else:
                filter_expression = Attr('opis').contains(opis)
        
        if glumci:
            if filter_expression:
                filter_expression &= Attr('glumci').contains(glumci)
            else:
                filter_expression = Attr('glumci').contains(glumci)
        
        if reziser:
            if filter_expression:
                filter_expression &= Attr('reziser').contains(reziser)
            else:
                filter_expression = Attr('reziser').contains(reziser)
        
        if zanr:
            if filter_expression:
                filter_expression &= Attr('zanr').contains(zanr)
            else:
                filter_expression = Attr('zanr').contains(zanr)
        
        # Perform query
        if filter_expression:
            response = table.scan(
                FilterExpression=filter_expression
            )
        else:
            response = table.scan()

        # Log response for debugging
        print(f"DynamoDB response: {response}")

        items = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'body': json.dumps(items),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods':"GET,OPTIONS"
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
                'Access-Control-Allow-Methods':"GET,OPTIONS"
            }
        }
