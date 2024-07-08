from aws_cdk import (
    # Duration,
    RemovalPolicy,
    Stack,
    aws_apigateway as apigateway,
    aws_lambda as _lambda,
    aws_dynamodb as dynamodb,
    aws_iam as iam, BundlingOptions, Duration,
    aws_sqs as sqs,
    aws_dynamodb as dynamodb,
    aws_stepfunctions as sfn,
    aws_stepfunctions_tasks as tasks,
    aws_s3 as s3,
    aws_cognito as cognito,
    aws_sns as sns,
    aws_sns_subscriptions as subs,
    aws_lambda_event_sources as lambda_event_sources,
    aws_stepfunctions as sfn
)
from constructs import Construct
from aws_cdk.aws_lambda import LayerVersion 
import boto3


class CloudBackMain(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)


    #pravimo dinamo bazu

        # table=dynamodb.Table(
        #     self,'TabelaFilmova',
        #     table_name='TabelaFilmova',
        #     partition_key={'name': 'id_filma', 'type': dynamodb.AttributeType.STRING},
        #     sort_key={'name': 'naslov', 'type': dynamodb.AttributeType.STRING},
        # )
        table= dynamodb.Table.from_table_name(
            self, 'TabelaFilmova',
            table_name='TabelaFilmova'  # Ime postojeće DynamoDB tabele
        )
        # Reference to the search table
        search_table = dynamodb.Table.from_table_name(
            self, 'SearchMoviesTable',
            table_name='SearchMoviesTable'
        )

        records_table = dynamodb.Table.from_table_name(
            self, 'FeedRecordsTable',
            table_name='FeedRecordsTable' 
        )

        # records_table=dynamodb.Table(
        #     self,'FeedRecordsTable',
        #     table_name='FeedRecordsTable',
        #     partition_key={'name': 'id_filma', 'type': dynamodb.AttributeType.STRING},
        #     sort_key={'name': 'username', 'type': dynamodb.AttributeType.STRING},
        # )


        # dv_table=dynamodb.Table(  #downloads - view table
        #     self,'DVTable',
        #     table_name='DVTable',
        #     partition_key={'name': 'username', 'type': dynamodb.AttributeType.STRING},
        #     sort_key={'name': 'timestamp', 'type': dynamodb.AttributeType.STRING},
        # )

        dv_table = dynamodb.Table.from_table_name(
            self, 'DVTable',
            table_name='DVTable' 
        )


          # Kreiranje S3 bucketa
        bucket = s3.Bucket(self, "moviesbucket",
                           removal_policy=RemovalPolicy.DESTROY,  # Za razvojno okruženje, uklonite za produkciju
                           auto_delete_objects=True)  # Automatsko brisanje objekata prilikom brisanja bucketa

       

        user_pool = cognito.UserPool(
            self, "UserPoolMovie",
            user_pool_name="MovieAppUserPool",
            self_sign_up_enabled=True,  # Omogućava korisnicima da se sami registruju
            auto_verify=cognito.AutoVerifiedAttrs(email=True),  # Automatska verifikacija email-a
            password_policy=cognito.PasswordPolicy(
                min_length=8,
                require_digits=True,
                require_lowercase=True,
                require_uppercase=True,
                require_symbols=False
                ),
            sign_in_aliases=cognito.SignInAliases(email=True),
            account_recovery=cognito.AccountRecovery.EMAIL_ONLY,
            standard_attributes=cognito.StandardAttributes(
                email=cognito.StandardAttribute(required=True)
            )
        )

        # Kreiranje grupe za administratore
        admin_group = cognito.CfnUserPoolGroup(
            self, "AdminGroup",
            user_pool_id=user_pool.user_pool_id,
            group_name="Admins",
            description="Administrative users group")
        
        # Kreiranje grupe za korisnike
        user_group = cognito.CfnUserPoolGroup(
            self, "UserGroup",
            user_pool_id=user_pool.user_pool_id,
            group_name="Users",
            description="Users group")
        
        # Definisanje IAM role za administratore
        admin_role = iam.Role(
            self, "AdminRole",
            assumed_by=iam.FederatedPrincipal(
                "cognito-identity.amazonaws.com",
                {
                    "StringEquals": {
                        "cognito-identity.amazonaws.com:aud": user_pool.user_pool_id
                    },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.amazonaws.com:amr": "authenticated"
                    }
                },
                "sts:AssumeRoleWithWebIdentity"))
        
        # Definicija IAM uloge za običnog korisnika
        user_role = iam.Role(
            self, "UserRole",
            assumed_by=iam.FederatedPrincipal(
                "cognito-identity.amazonaws.com",
                {
                    "StringEquals": {
                        "cognito-identity.amazonaws.com:aud": user_pool.user_pool_id
                    },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.amazonaws.com:amr": "authenticated"
                    }
                },
                "sts:AssumeRoleWithWebIdentity"
            )
        )
        layer_policy_statement = iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            actions=["lambda:GetLayerVersion"],
            resources=["arn:aws:lambda:eu-central-1:590183980405:layer:ffmpeg:1"]
        )
        admin_role.add_to_policy(layer_policy_statement)
        user_role.add_to_policy(layer_policy_statement)
        # Dodavanje dozvola IAM ulozi za običnog korisnika
        user_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "dynamodb:GetItem",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                    "s3:GetObject",
                    "s3:ListBucket",
                    "sqs:sendMessage"
                ],
                resources=[
                    table.table_arn,
                    f"{bucket.bucket_arn}/*"]))
                
        admin_role.add_to_policy(iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            actions=["s3:PutObject","s3:GetObject","dynamodb:GetItem",],
            resources=[table.table_arn,f"{bucket.bucket_arn}/*"]))
        admin_role.add_to_policy(iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=["dynamodb:PutItem"],
        resources=[f"{table.table_arn}/*"]
    ))
            # Dodavanje dozvola za admin ulogu
        admin_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "dynamodb:GetItem",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                    "s3:GetObject",
                    "s3:ListBucket",
                    "cognito-idp:AdminCreateUser",
                    "cognito-idp:AdminInitiateAuth",
                    "cognito-idp:AdminRespondToAuthChallenge",
                    "cognito-idp:InitiateAuth",
                    "cognito-idp:RespondToAuthChallenge",
                    "cognito-idp:AdminGetUser",
                    "cognito-idp:GlobalSignOut",
                    "cognito-idp:AdminAddUserToGroup",
                    "cognito-idp:AdminListGroupsForUser",
                    "iam:ListAttachedRolePolicies",
                "iam:ListRolePolicies",
                "iam:GetRolePolicy",
                 "sns:Subscribe",
                "sns:ListSubscriptionsByTopic",
                "sqs:SendMessage"
                ],
                resources=[
                    table.table_arn,
                    f"{bucket.bucket_arn}/*",
                    user_pool.user_pool_arn,
                    admin_role.role_arn,
                    "arn:aws:sns:*:*:*"
                
                ]
            )
        )


        #Dodavanje role na grupu
        admin_group.role_arn = admin_role.role_arn

        user_group.role_arn = user_role.role_arn
     

        app_client = cognito.UserPoolClient(
            self, "MovieAppClient",
            user_pool=user_pool,
            auth_flows=cognito.AuthFlow(
                user_password=True,
                user_srp=True
            ),
            generate_secret=False,
            o_auth={
                'flows': {
                    'implicit_code_grant': True,
                    'authorization_code_grant': True
                },
                'callback_urls': [
                    'http://localhost:4200'
                ],
                'logout_urls': [
                    'http://localhost:4200'
                ]
            },
            supported_identity_providers=[
                cognito.UserPoolClientIdentityProvider.COGNITO
            ]
        )



        lambda_role = iam.Role(
            self, "LambdaRole",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com")
        )
        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name("service-role/AWSLambdaBasicExecutionRole")
        )
        lambda_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "dynamodb:DescribeTable",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:DeleteItem",
                    "s3:PutObject",
                    "s3:GetObject",
                    "s3:*",
                    "s3:PutObjectACL",
                    "cognito-idp:AdminCreateUser",
                    "cognito-idp:AdminInitiateAuth",
                    "cognito-idp:AdminRespondToAuthChallenge",
                    "cognito-idp:InitiateAuth",  # Dozvola za inicijaciju autentifikacije
                     "cognito-idp:RespondToAuthChallenge",  # Dozvola za odgovaranje na autentifikacioni izazov
                    "cognito-idp:AdminGetUser",  # Dozvola za dobijanje podataka o korisniku preko Admin API-ja
                    "cognito-idp:GlobalSignOut",  # Dozvola za globalan odjavljivanje korisnika
                    "cognito-idp:AdminAddUserToGroup",
                    "cognito-idp:AdminListGroupsForUser",
                    "iam:GetRolePolicy",
                    "sns:GetTopicAttributes",
                    "sqs:SendMessage"
                ],
                # resources=[table.table_arn]
                 resources=[
                    records_table.table_arn,
                    table.table_arn,
                    f"{bucket.bucket_arn}/*",
                    user_pool.user_pool_arn,
                     f"arn:aws:cognito-idp:{self.region}:{self.account}:userpool/{user_pool.user_pool_id}",
                     admin_role.role_arn,
                     "arn:aws:sns:*:*:*"
                    
                  # bucket.bucket_arn
                ]
            )
        )


        def create_lambda_function(id, name, handler, include_dir, method, layers):
            function = _lambda.Function(
                self, id,
                function_name=name,


                runtime=_lambda.Runtime.PYTHON_3_9,
                layers=layers,
                handler=handler,
                code=_lambda.Code.from_asset(include_dir),
                memory_size=512,
                timeout=Duration.seconds(60),     
                environment={
                    'TABLE_NAME': table.table_name,
                    'SEARCH_TABLE_NAME': search_table.table_name,
                    'BUCKET_NAME': bucket.bucket_name,
                    'USER_POOL_ID':user_pool.user_pool_id,
                    'S3_BUCKET_ARN': bucket.bucket_arn,
                    'DYNAMODB_TABLE_ARN': table.table_arn,
                    'FEED_RECORDS_TABLE_NAME': records_table.table_name,
                    'DV_TABLE_NAME':dv_table.table_name,
 
                },
                role=lambda_role
                
                
            )
            return function

        get_movie_lambda_function = create_lambda_function(
            "getMovies",  # id
            "getMoviesFunction",  # name
            "getMovies.lambda_handler",  # handler
            "getMovies",  # include_dir
            "GET",  # method
            []
        )

        login_user_lambda_function = create_lambda_function(
        "LoginUser",  # id
        "LoginUserFunction",  # name
        "loginUser.lambda_handler",  # handler
        "loginUser",  # include_dir
        "POST",  # method (pretpostavljamo da se koristi POST za login)
        []
        )
        change_resolution_lambda_function = create_lambda_function(
            "changeResolution",
            "changeResolutionFunction",
            "changeResolution.lambda_handler",
            "changeResolution",
            "POST", # valjda je POST nzm
            layers=[]#[ _lambda.LayerVersion.from_layer_version_arn(self, 'ffmpeg','arn:aws:lambda:eu-central-1:590183980405:layer:ffmpeg:1'),]
        )
        send_transcoding_message_lambda_function = create_lambda_function(
            "sendTranscodingMessage",
            "sendTranscodingMessageFunction",
            "sendTranscodingMessage.lambda_handler",
            "sendTranscodingMessage",
            "POST",
            []
        )
        util_layer = LayerVersion(
            self, 'UtilLambdaLayer',
            code=_lambda.Code.from_asset('libs'),
            compatible_runtimes=[_lambda.Runtime.PYTHON_3_9]
        )


        post_movie_lambda_function = create_lambda_function(
            "postMovies",  # id
            "postMoviesFunction",  # name
            "postMovies.lambda_handler",  # handler
            "postMovies",  # include_dir
            "POST",  # method
            []
        )

        get_movie_by_id_lambda_function = create_lambda_function(
            "getMovieById",  # id
            "getMovieByIdFunction",  # name
            "getMovieById.lambda_handler",  # handler
            "getMovieById",  # include_dir
            "GET",  # method
            []  # layers
        )

        add_user_to_group_lambda_function = create_lambda_function(
            "addUserToGroup",  # id
            "addUserToGroupFunction",  # name
            "addUserToGroup.lambda_handler",  # handler
            "addUserToGroup",  # include_dir
            "POST",  # method
            []
        )


        authorization_lambda_function = create_lambda_function(
            "AuthorizationFunction",
            "AuthorizationFunction",
            "authorization.lambda_handler", 
            "authorization", 
            "POST", 
            []  
        )
        authorization_lambda_function.add_to_role_policy(
        iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            actions=["iam:GetRolePolicy"],
            resources=[admin_role.role_arn]  # Zamijenite sa odgovarajućom IAM rolu kojoj želite da omogućite GetRolePolicy
        )
    )
        subscribe_genre_lambda_function = create_lambda_function(
        "SubscribeGenreFunction",  # id
        "SubscribeGenreFunction",  # name
        "subscribeGenre.lambda_handler",  # handler
        "subscribeGenre",  # include_dir
        "POST",  # method
        [] # layers
    )
        
        subscribe_actor_lambda_function = create_lambda_function(
        "SubscribeActorFunction",  # id
        "SubscribeActorFunction",  # name
        "subscribeActor.lambda_handler",  # handler
        "subscribeActor",  # include_dir
        "POST",  # method
        [] # layers
    )
        
        subscribe_director_lambda_function = create_lambda_function(
        "SubscribeDirectorFunction",  # id
        "SubscribeDirectorFunction",  # name
        "subscribeDirector.lambda_handler",  # handler
        "subscribeDirector",  # include_dir
        "POST",  # method
        [] # layers
    )
        
        unsubscribe_lambda_function = create_lambda_function(
                "unsubscribe",  # id
                "unsubscribeFunction",  # name
                "unsubscribe.lambda_handler",  # handler
                "unsubscribe",  # include_dir
                "POST",  # method
                []
            )
        

        post_record_lambda_function = create_lambda_function(
            "postRecord",  # id
            "postRecordFunction",  # name
            "postRecord.lambda_handler",  # handler
            "postRecord",  # include_dir
            "POST",  # method
            []  # layers
        )

        post_dv_lambda_function = create_lambda_function(
            "postDV",  # id
            "postDV",  # name
            "postDV.lambda_handler",  # handler
            "postDV",  # include_dir
            "POST",  # method
            []  # layers
        )



        # Kreiranje autorizatora
        authorizer = apigateway.TokenAuthorizer(
            self, "MovieAppAuthorizer",
            handler=authorization_lambda_function  
        )

        self.api = apigateway.RestApi(self, "MovieApp",
                                    rest_api_name="Movie apps",
                                    description="This service serves movie contents.",
                                    endpoint_types=[apigateway.EndpointType.REGIONAL], #API ce biti dostupan regionalno a ne globalno ili privatno
                                    default_cors_preflight_options={
                                        "allow_origins": apigateway.Cors.ALL_ORIGINS,
                                        "allow_methods": apigateway.Cors.ALL_METHODS, 
                                    }
                                    )
        
        register_user_lambda_function = create_lambda_function(
            "RegisterUser",  # id
            "RegisterUserFunction",  # name
            "registerUser.lambda_handler",  # handler
            "registerUser",  # include_dir
            "POST",
            []
        )
        search_movies_lambda_function = create_lambda_function(
            "searchMovies",
            "searchMoviesFunction",
            "searchMovies.lambda_handler",
            "searchMovies",
            "GET",
            []
        )

        get_topics_lambda_function = create_lambda_function(
            "getTopics",
            "getTopicsFunction",
            "getTopics.lambda_handler",
            "getTopics",
            "GET",
            []
        )

        delete_movie_lambda_function = create_lambda_function(
            "deleteMovie",
            "deleteMovieFunction",
            "deleteMovie.lambda_handler",
            "deleteMovie",
            "DELETE",
            []
        )

        put_movie_lambda_function = create_lambda_function(
            "putMovie",
            "putMovieFunction",
            "putMovie.lambda_handler",
            "putMovie",
            "PUT",
            []
        )

        get_records_lambda_function = create_lambda_function(
            "getRecords",
            "getRecordsFunction",
            "getRecords.lambda_handler",
            "getRecords",
            "GET",
            []
        )

        transcoding_queue = sqs.Queue(self, "TranscodingQueue",
                                      visibility_timeout=Duration.seconds(300),
                                      retention_period=Duration.days(7),
                                      encryption=None)
        
        send_transcoding_message_lambda_function.add_event_source(
            lambda_event_sources.SqsEventSource(
                queue=transcoding_queue,
                batch_size=1
            )
        )
        
        get_dvs_lambda_function = create_lambda_function(
            "getUserDVS",
            "getUserDVSFunction",
            "getUserDVS.lambda_handler",
            "getUserDVS",
            "GET",
            []
        )

        # Dodavanje dozvola Lambda funkciji za pristup DynamoDB tabeli
        table.grant_read_data(get_movie_lambda_function)
        table.grant_write_data(post_movie_lambda_function)
        table.grant_read_write_data(delete_movie_lambda_function)
        bucket.grant_delete(delete_movie_lambda_function)
        bucket.add_to_resource_policy(iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=["s3:PutObject"],
        principals=[lambda_role],
        resources=[bucket.bucket_arn + "/*"]
    ))
        
        records_table.grant_write_data(post_record_lambda_function)
        records_table.grant_read_data(get_records_lambda_function)

        dv_table.grant_write_data(post_dv_lambda_function)
        dv_table.grant_read_data(get_dvs_lambda_function)

       
        
        send_email_lambda_function = create_lambda_function(
            "SendEmail",   # id
            "SendEmailFunction",   # name
            "sendEmail.lambda_handler",   # handler
            "sendEmail",   # include_dir
            "POST",   # method (pretpostavljamo da će se koristiti POST metoda za slanje e-pošte)
            []   # layers (ako su potrebni)
        )

        
        drama_topic = sns.Topic(self, "DRAMATopic")
        drama_topic.add_subscription(subs.LambdaSubscription(send_email_lambda_function))

        komedija_topic=sns.Topic(self,"KOMEDIJATopic")
        komedija_topic.add_subscription(subs.LambdaSubscription(send_email_lambda_function))

        tragedija_topic=sns.Topic(self,"TRAGEDIJATopic")
        tragedija_topic.add_subscription(subs.LambdaSubscription(send_email_lambda_function))


        # Dodavanje dozvola za pristup IAM resursima
        send_email_lambda_function.add_to_role_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "ses:SendEmail",   # Akcija za slanje e-pošte preko SES-a
                    "ses:SendRawEmail" ,  # Akcija za slanje sirove e-pošte preko SES-a
                    "sns:Publish"
                ],
                resources=["*"]   # Zamijenite sa odgovarajućim resursima ili ostavite '' ako je dozvola globalna)
        )
        )






        
        #user_pool.grant_invoke(login_user_lambda_function)
        bucket.add_to_resource_policy(iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=["s3:GetObject"],
        principals=[iam.AnyPrincipal()],
        resources=[bucket.bucket_arn + "/*"]
    ))

        bucket.grant_put(post_movie_lambda_function)
        bucket.grant_write(post_movie_lambda_function)
        bucket.grant_read(get_movie_by_id_lambda_function)
        bucket.grant_read(get_movie_lambda_function)
        bucket.grant_read_write(change_resolution_lambda_function)
        search_table.grant_read_data(search_movies_lambda_function)

        register_user_integration = apigateway.LambdaIntegration(register_user_lambda_function)
        self.api.root.add_resource("registerUser").add_method("POST", register_user_integration)

        login_user_integration = apigateway.LambdaIntegration(login_user_lambda_function)
        self.api.root.add_resource("loginUser").add_method("POST", login_user_integration)

        add_user_to_group_integration = apigateway.LambdaIntegration(add_user_to_group_lambda_function)
        self.api.root.add_resource("addUserToGroup").add_method("POST", add_user_to_group_integration)

       
        get_movies_integration = apigateway.LambdaIntegration(get_movie_lambda_function) #integracija izmedju lambda fje i API gateway-a, sto znaci da API Gateway može pozivati Lambda funkciju kao odgovor na HTTP zahteve. 

        post_movies_integration = apigateway.LambdaIntegration(post_movie_lambda_function)
        get_movie_by_id_integration = apigateway.LambdaIntegration(get_movie_by_id_lambda_function)
        search_movies_integration = apigateway.LambdaIntegration(search_movies_lambda_function)
        change_resolution_integration = apigateway.LambdaIntegration(change_resolution_lambda_function)
        self.api.root.add_resource("changeResolution").add_method("POST",change_resolution_integration)
        #Ova metoda kreira novi resurs movies. To znači da će URL za ovaj resurs biti /movies.
        #To znači da će se, kada API Gateway primi GET zahtev na /movies, pozvati get_movie_lambda_function.
        
        get_movies_integration = apigateway.LambdaIntegration(get_movie_lambda_function) #integracija izmedju lambda fje i API gateway-a, sto znaci da API Gateway može pozivati Lambda funkciju kao odgovor na HTTP zahteve. 
        self.api.root.add_resource("movies").add_method("GET", get_movies_integration) #Ova metoda dodaje novi resurs pod nazivom movies na root nivou API-ja.

        delete_movie_integration = apigateway.LambdaIntegration(delete_movie_lambda_function)
        self.api.root.add_resource("deleteMovie").add_method("DELETE", delete_movie_integration, authorizer=authorizer)

        put_movie_integration = apigateway.LambdaIntegration(put_movie_lambda_function)
        self.api.root.add_resource("putMovie").add_method("PUT",put_movie_integration, authorizer=authorizer)
 
        self.api.root.add_resource("postMovies").add_method("POST", post_movies_integration,authorizer=authorizer)


        self.api.root.add_resource("getMovie").add_method("GET", get_movie_by_id_integration)
        self.api.root.add_resource("searchMovies").add_method("GET", search_movies_integration)

        send_transcoding_message_integration = apigateway.LambdaIntegration(send_transcoding_message_lambda_function)
        self.api.root.add_resource("sendTranscodingMessage").add_method("POST",send_transcoding_message_integration)

        send_email_integration = apigateway.LambdaIntegration(send_email_lambda_function)
        self.api.root.add_resource("sendEmail").add_method("POST", send_email_integration)

        subscribe_genre_integration = apigateway.LambdaIntegration(subscribe_genre_lambda_function)
        self.api.root.add_resource("subscribeGenre").add_method("POST", subscribe_genre_integration,authorizer=authorizer)

        subscribe_actor_integration = apigateway.LambdaIntegration(subscribe_actor_lambda_function)
        self.api.root.add_resource("subscribeActor").add_method("POST", subscribe_actor_integration,authorizer=authorizer)

        subscribe_director_integration = apigateway.LambdaIntegration(subscribe_director_lambda_function)
        self.api.root.add_resource("subscribeDirector").add_method("POST", subscribe_director_integration,authorizer=authorizer)


        get_topics_integration = apigateway.LambdaIntegration(get_topics_lambda_function) 

        self.api.root.add_resource("getTopics").add_method("GET", get_topics_integration)

        
        unsubscribe_integration = apigateway.LambdaIntegration(unsubscribe_lambda_function)
        self.api.root.add_resource("unsubscribe").add_method("POST", unsubscribe_integration,authorizer=authorizer)

       
        post_record_integration = apigateway.LambdaIntegration(post_record_lambda_function)
        self.api.root.add_resource("postRecord").add_method("POST", post_record_integration,authorizer=authorizer)


        get_records_integration = apigateway.LambdaIntegration(get_records_lambda_function)
        self.api.root.add_resource("getRecords").add_method("GET", get_records_integration)

        post_dv_integration = apigateway.LambdaIntegration(post_dv_lambda_function)
        self.api.root.add_resource("postDV").add_method("POST", post_dv_integration)

        get_dvs_integration = apigateway.LambdaIntegration(get_dvs_lambda_function)
        self.api.root.add_resource("getUserDVS").add_method("GET", get_dvs_integration)
