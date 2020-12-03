const AWS = require('aws-sdk');
var ses = new AWS.SES({ region: "us-east-1" });


const timetolive = 900;



var DynamoDocClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

exports.handler = (event, context, callback) => {
  
    console.log(event.Records[0].Sns.Message);
    
    
   var message = JSON.parse(event.Records[0].Sns.Message);
    console.log(message);
    
    var id = event.Records[0].Sns.MessageId;
    

    var parameter = {
        Item: {
            'id': event.Records[0].Sns.MessageId,
          'EMAIL_ADDRESS': message.email_address,
          'QUESTION_ID': message.question_id,
          'ANSWER_ID': message.answer_id,
          'ANSWER_TEXT': message.answer_text
  
        },
        TableName: "csye6225"
    };

    function putIntoDynamo() {
        return new Promise(function (resolve, reject) {
            DynamoDocClient.put(parameter, function (err, data) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(data);
                }
            });
        });
    }
    
    
    async function putDynamoAsync(){
        var inserter = await putIntoDynamo();
    }
    putDynamoAsync();

        var ses_params = {
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
     

    return ses.sendEmail(ses_params).promise()

    callback(null, "Success");
}