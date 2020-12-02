var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });


console.log('Loading function');

exports.handler = function(event, context, callback) {
// console.log('Received event:', JSON.stringify(event, null, 4));

    var message = event.Records[0].Sns.Message;
    var email = event.Records[0].Sns.Message.username; 
    console.log('Message received from SNS:', message);

    var params = {
        Destination: {
          ToAddresses: ["jai.subash@hotmail.com"]
        },
        Message: {
          Body: {
            Text: {  Data: message },
          },
    
          Subject: { Data: "This is a notification message from WebApp. Please open and check your request. " },
        },
        Source: "clouddays123@gmail.com",
      };
     

    return ses.sendEmail(params).promise()

    callback(null, "Success");

    
};