# import jwt
# import boto3
# import os

# s3_client = boto3.client('s3')

# def lambda_handler(event, context):
#     print(event)
#     token = event["authorizationToken"]
#     token = token.split(" ")[1]  # bez "Bearer"
    
#     try:
#         # dekodiranje tokena
#         jwt_payload = jwt.decode(token, options={"verify_signature": False})
        
#         # grupe korisnika iz JWT payload-a
#         groups = jwt_payload.get('cognito:groups', [])
        
#         # provera dozvola na osnovu grupa
#         if 'Admins' in groups:
#             print("Usaoooooooooooooooooo  ",groups)
#             # Ako je korisnik u 'Admins' grupi, dozvolite pristup S3 bucket-u i DynamoDB tabeli
#             s3_bucket_arn = os.environ['S3_BUCKET_ARN']
#             s3_resource = f"{s3_bucket_arn}/*"  # Dozvoli pristup svim objektima u bucket-u

#             dynamodb_table_arn = os.environ['DYNAMODB_TABLE_ARN']
#             dynamodb_resource = f"{dynamodb_table_arn}/*"

#             # Vratite generisanu politiku sa dozvoljenim akcijama i resursima
#             return generate_policy(jwt_payload['sub'], 'Allow', ['s3:PutObject', 'dynamodb:PutItem'], [s3_resource, dynamodb_resource])
#            # return generate_policy(jwt_payload['sub'], iam.Effect.Allow, ['s3:PutObject', 'dynamodb:PutItem'], [s3_resource, dynamodb_resource])
#         else:
#             # Ako korisnik nije u 'Admins' grupi, zabranite pristup S3 i DynamoDB
#             return generate_policy(jwt_payload['sub'], 'Deny', '*', '*')  # Primer politike zabrane za sve resurse
#     except jwt.InvalidTokenError as e:
#         # Obrada greške nevažećeg JWT tokena
#         print(f"Greška pri dekodiranju JWT tokena: {str(e)}")
#         return generate_policy(None, 'Deny', '*', '*')
#     except Exception as e:
#         # Obrada bilo koje druge greške
#         print(f"Greška: {str(e)}")
#         return generate_policy(None, 'Deny', '*', '*')

# def generate_policy(principal_id, effect, action, resource):
#     # Generisanje politike za autorizaciju
#     auth_response = {
#         'principalId': principal_id,
#         'policyDocument': {
#             'Version': '2012-10-17',
#             'Statement': [{
#                 'Action': action,  # Definišite dozvoljene ili zabranjene akcije
#                 'Effect': effect,  # Efekat politike ('Allow' ili 'Deny')
#                 'Resource': resource  # Resurs na koji se politika odnosi (ARN S3 bucket-a ili druge vrste resursa)
#             }]
#         }
#     }
#     print("Auth response : ",auth_response)
#     return auth_response

import jwt
import boto3
import os

s3_client = boto3.client('s3')
iam = boto3.client('iam')

def lambda_handler(event, context):
    print(event)
    token = event["authorizationToken"]
    token = token.split(" ")[1]  # bez "Bearer"
    
    try:
        # dekodiranje tokena
        jwt_payload = jwt.decode(token, options={"verify_signature": False})
        
        # grupe korisnika iz JWT payload-a
        groups = jwt_payload.get('cognito:groups', [])
        
        # provera dozvola na osnovu grupa
        if 'Admins' in groups:
            print("USAOOO JEEEEE VESNA ")
           # print(admin_dynamodb_permissions)
           # print("PERMISIJE S3  ",admin_s3_permissions)
            # Ako je korisnik u 'Admins' grupi, dozvolite pristup S3 bucket-u i DynamoDB tabeli
            s3_bucket_arn = os.environ['S3_BUCKET_ARN']
            s3_resource = f"{s3_bucket_arn}/*"  # Dozvoli pristup svim objektima u bucket-u

            dynamodb_table_arn = os.environ['DYNAMODB_TABLE_ARN']
            dynamodb_resource = f"{dynamodb_table_arn}/*"

            # Uzmi dozvole za admin_role iz IAM politike
            admin_role_policy = iam.get_role_policy(
                RoleName='admin_role',
                PolicyName='AdminPolicy'
            )
            print("96 LINIJA")
            # Izvadi dozvole za S3 i DynamoDB iz politike admin_role-a
            admin_s3_permissions = [
                statement['Action']
                for statement in admin_role_policy['PolicyDocument']['Statement']
                if statement['Effect'] == 'Allow' and 's3:' in statement['Action']
            ]
            admin_dynamodb_permissions = [
                statement['Action']
                for statement in admin_role_policy['PolicyDocument']['Statement']
                if statement['Effect'] == 'Allow' and 'dynamodb:' in statement['Action']
            ]

          
            
            # Vrati generisanu politiku sa dozvoljenim akcijama i resursima
            return generate_policy(jwt_payload['sub'], 'Allow', admin_s3_permissions + admin_dynamodb_permissions, [s3_resource, dynamodb_resource])
        else:
            # Ako korisnik nije u 'Admins' grupi, zabranite pristup S3 i DynamoDB
            return generate_policy(jwt_payload['sub'], 'Deny', '*', '*')  # Primer politike zabrane za sve resurse
    except jwt.InvalidTokenError as e:
        # Obrada greške nevažećeg JWT tokena
        print(f"Greška pri dekodiranju JWT tokena: {str(e)}")
        return generate_policy(None, 'Deny', '*', '*')
    except Exception as e:
        # Obrada bilo koje druge greške
        print(f"Greška: {str(e)}")
        return generate_policy(None, 'Deny', '*', '*')

def generate_policy(principal_id, effect, actions, resources):
    # Generisanje politike za autorizaciju
    auth_response = {
        'principalId': principal_id,
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [{
                'Action': actions,  # Definišite dozvoljene ili zabranjene akcije
                'Effect': effect,  # Efekat politike ('Allow' ili 'Deny')
                'Resource': resources  # Resurs na koji se politika odnosi (ARN S3 bucket-a ili druge vrste resursa)
            }]
        }
    }
    print("Auth response : ", auth_response)
    return auth_response
