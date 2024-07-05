import boto3
from botocore.exceptions import ClientError
import json

ses_client = boto3.client('ses')

def lambda_handler(event, context):
    try:
        # Prima podatke o e-pošti iz HTTP zahteva (pretpostavljeno je da je event['body'] JSON objekat)
        email_data = json.loads(event['body'])

        # Slanje e-pošte
        response = ses_client.send_email(
            Source=email_data['sender'],
            Destination={'ToAddresses': [email_data['recipient']]},
            Message={
                'Subject': {'Data': email_data['subject']},
                'Body': {'Text': {'Data': email_data['body']}}
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps('Email successfully sent')
        }

    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps('Error sending email: {}'.format(e.response['Error']['Message']))
}