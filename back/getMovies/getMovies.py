import json
import boto3

def lambda_handler(event, context):
    #Ova funkcija je ulazna tačka za Lambda funkciju koja će biti pozvana kada API Gateway primi HTTP zahtev.
    # Kreiranje klijenta za pristup DynamoDB
    dynamodb = boto3.resource('dynamodb')
    
    # Ime tabele
    table_name = 'TabelaFilmova'
    
    # Referenca na DynamoDB tabelu
    table = dynamodb.Table(table_name)
    
    try:
        # Čitanje podataka iz tabele
        response = table.scan()
        
        # Vraćanje odgovora sa podacima iz tabele
        return {
            'statusCode': 200,
            'body': json.dumps(response['Items'])
        }
    except Exception as e:
        # Vraćanje greške ako dođe do problema
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
