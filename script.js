console.log('Loading function');

const https = require('https');

const doPostRequest = (data) => {

  return new Promise((resolve, reject) => {
    const options = {
      host: 'discord.com',
      path: '<PATH FROM YOUR DISCORD SERVER - NEED TO REPLACE>',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    //create the request object with the callback with the result
    const req = https.request(options, (res) => {
      resolve(JSON.stringify(res.statusCode));
    });

    // handle the possible errors
    req.on('error', (e) => {
      reject(e.message);
    });
    
    //do the request
    req.write(JSON.stringify(data));

    //finish the request
    req.end();
  });
};

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    for (const record of event.Records) {
        if (record.eventName == 'INSERT') {
          var url = record.dynamodb.NewImage.url.S;
          var pi = record['dynamodb']['NewImage']['pepper-index']['S'];
          var piScore = record['dynamodb']['NewImage']['pepper-index-score']['N'];
          var ei = record['dynamodb']['NewImage']['eco-index']['N'];
          var lhPerf = record['dynamodb']['NewImage']['lighthouse-perf']['N'];
          var lhAcc = record['dynamodb']['NewImage']['lighthouse-accessibility']['N'];
          var lhBp = record['dynamodb']['NewImage']['lighthouse-best-practices']['N'];
          var lhSeo = record['dynamodb']['NewImage']['lighthouse-seo']['N'];
          var carbon = record['dynamodb']['NewImage']['carbon']['N'];
          
            await doPostRequest({"content":`${url}
**Pepper Index**: *${pi}*
**Pepper Score**: *${piScore}*
**Carbon Index**: *${carbon}*
--
Eco-Index: *${ei}*
Performance: *${lhPerf}*
Accessibility: *${lhAcc}*
Best Practices: *${lhBp}*
SEO: *${lhSeo}*
`})
              .then(result => console.log(`Status code: ${result}`))
              .catch(err => console.error(`Error doing the request for the event: ${JSON.stringify(event)} => ${err}`));
        }
        
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
    }
    return `Successfully processed ${event.Records.length} records.`;
};
