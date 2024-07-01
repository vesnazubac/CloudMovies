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

        # Check if all parameters are present and not empty
        use_query = all([naslov, opis, glumci, reziser, zanr])

        if use_query:
            # Build KeyConditionExpression for query
            combined_key = f"{naslov}|{glumci}|{opis}|{reziser}|{zanr}"
            response = table.query(
                IndexName='combined_key-index',
                KeyConditionExpression=Key('combined_key').eq(combined_key)
            )
            items = response.get('Items', [])
        else:
            # Perform scan with FilterExpression
            filter_expression = None
            
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
            
            # Perform scan with FilterExpression
            if filter_expression:
                response = table.scan(
                    FilterExpression=filter_expression
                )
            else:
                response = table.scan()

            items = response.get('Items', [])

        # Log response for debugging
        print(f"DynamoDB response: {response}")

        return {
            'statusCode': 200,
            'body': json.dumps(items),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                'Access-Control-Allow-Methods': "GET,OPTIONS"
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
                'Access-Control-Allow-Methods': "GET,OPTIONS"
            }
        }
