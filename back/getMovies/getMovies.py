from decimal import Decimal
import json
import boto3

def lambda_handler(event, context):
    #Ova funkcija je ulazna tačka za Lambda funkciju koja će biti pozvana kada API Gateway primi HTTP zahtev.
    # Kreiranje klijenta za pristup DynamoDB
    dynamodb = boto3.resource('dynamodb')
    #ubaci s3
    
    # Ime tabele
    table_name = 'TabelaFilmova'
    
    # Referenca na DynamoDB tabelu
    table = dynamodb.Table(table_name)
    
    try:
        # Čitanje podataka iz tabele
        response = table.scan()
        
        items=response.get('Items',[])
        
        for item in items:
            for key,value in item.items():
                if isinstance(value,Decimal):
                    item[key]=float(value)

        #items = response['Items']
        
        # Dodavanje novog atributa svim stavkama
        #for item in items:
        #    table.update_item(
        #        Key={
        #            'id_filma': item['id_filma'],  # Zamenite sa stvarnim primarnim ključem
        #            'naslov': item['naslov']
        #        },
        #        UpdateExpression="SET reziser = :reziser, glumci = :glumci",
        #        ExpressionAttributeValues={
        #            ':reziser': 'default_reziser',
        #            ':glumci': 'default_glumac1,default_glumac2'
        #        }
        #    )

        # Ponovno čitanje podataka iz tabele nakon ažuriranja
        #response = table.scan()
        # Vraćanje odgovora sa podacima iz tabele
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
        # Vraćanje greške ako dođe do problema
        return {
            'statusCode': 500,
            'body': json.dumps(str(e)),
              'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            }
        }
