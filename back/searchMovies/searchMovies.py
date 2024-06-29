import json
import boto3
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table_name = 'TabelaFilmova'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # Log the entire event for debugging
        print(f"Received event: {json.dumps(event)}")

        # Extract query parameters
        query_params = event.get('queryStringParameters', {})
        
        # Define possible query parameters
        naslov = query_params.get('naslov', '')
        opis = query_params.get('opis', '')
        glumci = query_params.get('glumci', '')
        reziser = query_params.get('reziser', '')
        zanr = query_params.get('zanr', '')

        # Build the filter expression dynamically
        filter_expression = None
        
        if naslov:
            filter_expression = Attr('naslov').contains(naslov)
        
        if opis:
            filter_expression &= Attr('opis').contains(opis) if filter_expression else Attr('opis').contains(opis)
        
        if glumci:
            filter_expression &= Attr('glumci').contains(glumci) if filter_expression else Attr('glumci').contains(glumci)
        
        if reziser:
            filter_expression &= Attr('reziser').contains(reziser) if filter_expression else Attr('reziser').contains(reziser)
        
        if zanr:
            filter_expression &= Attr('zanr').contains(zanr) if filter_expression else Attr('zanr').contains(zanr)
        
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
        if not items:
            raise ValueError("No movies found")

        return {
            'statusCode': 200,
            'body': json.dumps(items)
        }
    except Exception as e:
        # Log error
        print(f"An error occurred: {e}")
        # Return error response
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
