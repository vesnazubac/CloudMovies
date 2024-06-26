from aws_cdk import (
    # Duration,
    RemovalPolicy,
    Stack,
    aws_apigateway as apigateway,
    aws_lambda as _lambda,
    aws_dynamodb as dynamodb,
    aws_iam as iam, BundlingOptions, Duration,
    # aws_sqs as sqs,
    aws_dynamodb as dynamodb,
    aws_stepfunctions as sfn,
    aws_stepfunctions_tasks as tasks,
    aws_s3 as s3
)
from constructs import Construct



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

          # Kreiranje S3 bucketa
        bucket = s3.Bucket(self, "moviesbucket",
                           removal_policy=RemovalPolicy.DESTROY,  # Za razvojno okruženje, uklonite za produkciju
                           auto_delete_objects=True)  # Automatsko brisanje objekata prilikom brisanja bucketa




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
                    "s3:PutObjectACL"
                ],
                # resources=[table.table_arn]
                 resources=[
                    table.table_arn,
                    f"{bucket.bucket_arn}/*"
                  # bucket.bucket_arn
                ]
            )
        )

        # def create_lambda_function(id,name, handler, include_dir, method, layers):
        #     function = _lambda.Function(
        #         self, id,
        #         function_name=name,
        #         runtime=_lambda.Runtime.PYTHON_3_9,
        #         layers=layers,
        #         handler=handler,
        #         code=_lambda.Code.from_asset(include_dir,
        #                                      # bundling=BundlingOptions(
        #                                      #     image=_lambda.Runtime.PYTHON_3_9.bundling_image,
        #                                      #     command=[
        #                                      #          "cmd.exe", "/c",  # Koristimo cmd.exe za pokretanje komandi na Windows-u
        #                                      # "pip install --no-cache -r requirements.txt -t . && copy .\\* ..\\asset-output"
        #                                      #     ],
        #                                      # ),
        #                                      ),
        #         memory_size=128,
        #         timeout=Duration.seconds(10),
        #         environment={
        #             'TABLE_NAME': table.table_name
        #         },
        #         role=lambda_role
        #     )

        
        # get_movie_lambda_function = create_lambda_function(
        #     "getMovies", #id - jedinstveni identifikator za lambda fju u okviru CDK stacka. Koristi se interno od strane CDK za identifikaciju resursa
        #     "getMoviesFuction", #name - ime lambda funkcije koje ce biti prikazano na aws konzoli, koristimo ga za identifikaciju fje unutar AWS naloga
        #     "getMovies.lambda_handler", #handler - specificira handler za Lambda fju odnosno ulaznu tacku funkcije. getMovies je naziv fajla a lambda_handler je naziv fje unutar tog fajla koja ce biti pozvana kada se Lambda fja
        #     "getMovies", #dir - Ovaj argument specificira direktorijum u kojem se nalazi kod Lambda funkcije. getMovies je ime direktorijuma koji sadrži sve potrebne fajlove za ovu Lambda funkciju.
        #     "GET", #method - vaj argument definiše HTTP metodu koju će Lambda funkcija koristiti u kontekstu integracije sa API Gateway-om. U ovom slučaju, to je GET metoda
        #     []
        # )


        def create_lambda_function(id, name, handler, include_dir, method, layers):
            function = _lambda.Function(
                self, id,
                function_name=name,
                runtime=_lambda.Runtime.PYTHON_3_9,
                layers=layers,
                handler=handler,
                code=_lambda.Code.from_asset(include_dir),
                memory_size=128,
                timeout=Duration.seconds(10),
                environment={
                    'TABLE_NAME': table.table_name,
                    'BUCKET_NAME': bucket.bucket_name
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

     


         


        self.api = apigateway.RestApi(self, "MovieApp",
                                    rest_api_name="Movie apps",
                                    description="This service serves movie contents.",
                                    endpoint_types=[apigateway.EndpointType.REGIONAL], #API ce biti dostupan regionalno a ne globalno ili privatno
                                    default_cors_preflight_options={
                                        "allow_origins": apigateway.Cors.ALL_ORIGINS,
                                        "allow_methods": apigateway.Cors.ALL_METHODS,
                                      
                                    }
                                    )


        # Dodavanje dozvola Lambda funkciji za pristup DynamoDB tabeli
        table.grant_read_data(get_movie_lambda_function)

        table.grant_write_data(post_movie_lambda_function)
        bucket.add_to_resource_policy(iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        actions=["s3:PutObject"],
        principals=[lambda_role],
        resources=[bucket.bucket_arn + "/*"]
    ))
        bucket.grant_put(post_movie_lambda_function)
        bucket.grant_write(post_movie_lambda_function)
        bucket.grant_read(get_movie_by_id_lambda_function)
       
        get_movies_integration = apigateway.LambdaIntegration(get_movie_lambda_function) #integracija izmedju lambda fje i API gateway-a, sto znaci da API Gateway može pozivati Lambda funkciju kao odgovor na HTTP zahteve. 

        post_movies_integration = apigateway.LambdaIntegration(post_movie_lambda_function)
        get_movie_by_id_integration = apigateway.LambdaIntegration(get_movie_by_id_lambda_function)
        #Ova metoda kreira novi resurs movies. To znači da će URL za ovaj resurs biti /movies.
        #To znači da će se, kada API Gateway primi GET zahtev na /movies, pozvati get_movie_lambda_function.
        self.api.root.add_resource("movies").add_method("GET", get_movies_integration) #Ova metoda dodaje novi resurs pod nazivom movies na root nivou API-ja.

        #self.api.root("movies").add_method("POST", post_movies_integration)
           # Assume the movies resource already exists
        # moviesResource = self.api.root.get_resource("movies")
        # if moviesResource is None:
        #     # If not exists, create it (remove this part if you are sure it exists)
        #     moviesResource = self.api.root.add_resource("movies")

        # # Add POST method to the existing movies resource
        # moviesResource.add_method("POST", post_movies_integration)
 
        self.api.root.add_resource("postMovies").add_method("POST", post_movies_integration)


        self.api.root.add_resource("getMovie").add_method("GET", get_movie_by_id_integration)
      