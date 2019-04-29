## Basic Setup

This repo is packaged as an AWS Lambda function.

All you need is the AWS_LAMBDA.zip and you're good to go. 

The following configuration will work using the free tier with an Amazon AWS account.

The setup is split into two sections;
- Setting up the auto buy function.
- Setting up the timer to run the function every x minutes/days/hours.

 

**Setting up the AWS Lambda Function**

1) Create an Amazon AWS account.
2) Navigate to the AWS Lambda service, this will be under the Compute sub-menu. 
3) Click the 'new function' button & apply the following options;
- Author function from scratch.
- Select a name, any name.
- Runtime Node.js 8.10
- Click 'Create Function'
4) Within the Function Code settings, select the 'code entry' dropdown menu. There will be an option to upload a .zip file. Upload the AWS_LAMBDA.zip file there & click save.
5) In the basic settings section (near the bottom of the page) set the timeout to 1 minute & click save.
6) Finally, apply the following environmental variables;
Key | Value
-----------
API_KEY | your_binance_api_key
API_SECRET | your_binance_api_secret
MARKET | what market you want to buy eg. BTCUSDT
AMOUNT | how much of the asset you want to buy each time the function runs eg. 10 of the BTCUSDT pair would buy $10 USDT worth of BTC.
7) Save the function and you're done!

**Setting up the timer**

For the executing of the function we're going to use AWS Cloudwatch
1) Navigate to the Cloudwatch service, under the Management & Governance sub-menu.
2) Under the Events header on the sidebar, select Rules -> Create Rule.
3) Under Event Source select Pattern -> Cron Expression.
4) Enter the following cron expression, it will run the auto-buy function everyday at midnight: 0 0 ? * * * 
5) Under the Target section on the left, click Add Target -> Lambda Function -> Select your lambda function that we made in the previous section.
6) Click Configure Details at the bottom, enter a name & description for your function, ensure the 'enabled' button is checked and click Create Rule.
7) Done!
