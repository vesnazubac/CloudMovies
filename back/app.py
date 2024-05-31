#!/usr/bin/env python3
import os

import aws_cdk as cdk

from cloud_back_main import CloudBackMain


app = cdk.App()
CloudBackMain(app, "CloudBackMain",

            )

app.synth()
