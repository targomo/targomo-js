const fs = require("fs");

var arrayopened = false;
// test-reporter.js
class TestReporter {

    constructor(globalConfig, options) {
      this._globalConfig = globalConfig;
      this._options = options;
    }

    static addTest(name, expectedResponse, currentRequest){
        var start = '[';

        if(!arrayopened){
            arrayopened = true;
        }else {
            start = ',';
        }

        // This is super hacky to write this data to a file and using it later in onRunComplete
        // I tried to save it in a static class variable but that doesnt work for some reason (like this: https://stackoverflow.com/questions/28445693/how-do-i-make-a-public-static-field-in-an-es6-class (second answer, "equivalent to" part))
        // It does save the data to the variable, but when onRunComplete is called, this variable is empty again
        // Even though onRunComplete is definitely called after these addTest calls.
        fs.writeFileSync('testsToReport.txt',start + JSON.stringify({"name": name, "expected": expectedResponse, "request": currentRequest}), { flag: 'a+' });
    }

    onRunStart(results, options) {
        fs.writeFileSync('testsToReport.txt', '');
    }

    onRunComplete(contexts, results) {
        // Add the last ']' so the JSON is valid and can be parsed
        fs.writeFileSync('testsToReport.txt',']', { flag: 'a+' });
        var testsToReport;
        try {
            testsToReport = JSON.parse(fs.readFileSync('testsToReport.txt', 'utf8'));
        } catch (e) {
            console.error(e);
        }
        fs.unlinkSync('testsToReport.txt');
        if(testsToReport){
            // Look at all the results, if a result has the status 'failed', then all the information will be gathered and written to a file
            results.testResults.forEach(testResult => {
                testResult.testResults.forEach(result => {
                    if(result.status === 'failed'){
                        var title = result.title;
                        var error = result.failureMessages[0];
                        var request, expected;
                        var found = false;
                        testsToReport.forEach(test => {
                            if(!found){
                                if(test.name === title){
                                    found = true;
                                    request = test.request;
                                    expected = test.expected;
                                }
                            }
                        });
                        if(found){
                            this.writeToErrorLog(title, error, request, expected);
                        }else {
                            console.log('problem in the onTestResult handling code');
                        }

                    }
                });
            });
        }
    }

      writeToErrorLog(title, error, request, expected){
        // Remove the color codes (? i guess) from the response
        var message = JSON.stringify(error).replace(/\\u\d\d\db\[([0-9]*)?m/gi, '');

        // Replace the literal '\n' parts with actual newlines
        message = message.replace(/\\n/gi, '\n');

        // Remove \\\ littered all over the message
        message = message.replace(/\\\\\\/gi, '');

        // This ending makes the JSON invalid making it impossible to parse it and make it look pretty with JSON.parse(...),
        // so it needs to be removed as well
        message = message.replace(/}\\""/gi, '}');

        // Remove the stacktrace at the end of the message which makes the JSON invalid
        message = message.replace(/(\\"\n)?    at (.*?(\n    )?)*/gi, '');

        // If the string after "instead received" is JSON, then format it as JSON
        var split = message.split('instead received');
        if (split.length > 1) {
            let value = split[1];
            try {
            value = JSON.stringify(JSON.parse(value), null, 4);
            } catch (e) {                
                console.log("not json");
            }
            message = split[0] + 'instead received\n\n' + value;
        }



      var requestText = JSON.stringify(request, null, 4);
    

      fs.writeFileSync('testResults.txt',
        '==========================\n|           ID:          |\n==========================\n' + title + '\n' +
        '==========================\n|        Expected:       |\n==========================\n' + expected + '\n' +
        '==========================\n|        Request:        |\n==========================\n' + requestText + '\n' +
        '==========================\n|        Response:       |\n==========================\n' + message +
        '\n\n\n=================================================================================\n\n\n', { flag: 'a+' }
      );
    
    }
  }

  module.exports = TestReporter;
