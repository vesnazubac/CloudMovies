import json

def lambda_handler(event,context):
    key = event['key']
    resolutions=[720,480,360]
    return {
        'original_key': key,
        'resolutions': resolutions
    }