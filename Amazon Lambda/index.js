'use strict';

const Alexa = require('alexa-sdk');
var http = require('http');
var fs = require("fs");


//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';

const APP_ID = 'amzn1.ask.skill.a3277e0c-5001-40f0-8bb9-9636f53e3b96';

const SKILL_NAME = 'PredictIt';
const GET_FACT_MESSAGE = "Here's some prediction: ";
const HELP_MESSAGE = 'You can say tell me some political prediction, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
// hard-coded
//=========================================================================================================================================
const data = [
    'According to PredictIt, the Democrats will control the House after 2018',
    'According to PredictIt, the Republicans will control the Senate after 2018',
    'It is likely that Judge Anthony Kennedy will leave the Supreme Court',
    'There is a 54% chance Trump will be the 2020 nominee',
    'According to PredictIt, there is a 59% chance that the Democratic Party will win the White House in 2020',
    'According to PredictIt, Senator bob Corker is likely to lose the Tennessee GOP Senate primary',
    'According to PredictIt, Nancy Pelosi will likely win the Democratic primary for Californias 12th District',
    'There is a 62% chance that Joe Biden will run for president in 2020',
    'According to PredictIt, There is a 67% chance that Bernie Sanders will run for president in 2020',
    'There is a 72% chance that Cory Booker will run for president in 2020',
    'According to PredictIt, There is a 60% chance that Andrew Cuomo will run for president in 2020.',
    'According to PredictIt, It is likely that Senator Elizabeth Warren will be reelected',
    'It is likely that Senator Dianne Feinstein will be reelected',
    'According to PredictIt, there is a 59% chance that Paul Ryan will be Speaker of the House at year-end 2018',
    'It is strongly likely that Chuck Schumer will be Senate minority leader at year-end 2018',
    'There is a 12% chance that Donald Trump will be impeached by year-end 2018',
    'It is unlikely that Robert Mueller will be replaced as Special Counsel by June 30, 2018',
    'According to PredictIt, there is a 22% chance that James Comey testify before Congress by June 30, 2018',
    'According to PredictIt, there is a 2% chance that Trump will attend Prince Harrys wedding on May 19',
    'It is likely that the Democratic party will win the 2018 House of Representatives race in Washingtons 8th district',
];


exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    //By having a single 'Unhandled' handler, we ensure all requests are route to it
    'Unhandled': function () {
        //log the event sent by the Alexa Service in human readable format
        //console.log(JSON.stringify(this.event));
        //console.log("this : " + JSON.stringify(this.event));

        // Read JSON file Synchrously
        var json = fs.readFileSync("market.json");
        var json_objects = JSON.parse(json);
        var markets = json_objects.Markets
        var contracts =  {};
        var contractIndex = 0;
        var prediction = "";
        var winpercent = 0.0;
        var alexa_response = "";
        var criteria_met = false;
    
        console.log("markets length:", markets.length);
        var market_sn = ""; //market shortname
        var ContractLongNameToLower = "";
        function ParseContractForCongress (slot_array)
        {
            console.log("enter ParseContractForCongress");
            // special case: 1 param: Which party will control the House after 2018 midterms?
            //
            console.log(" slot_array" + slot_array.length);
            if (slot_array.length == 1)
            {
                for (var i = 0; i < markets.length; i++) // search through markets
                {
                    market_sn = markets[i].ShortName.toLowerCase();
                    // if market shortname matches keyword
                    console.log("ParseContractForCongress Case 1: Searching for  control and = " + slot_array[0]);
                    if ( (market_sn.search(slot_array[0].toLowerCase()) > -1))
                    {
                        console.log("Market ID = " + markets[i].ID + " ShortName = " + market_sn);
                        contracts = markets[i].Contracts;
                        // Select random contract and respond
                        contractIndex = Math.floor(Math.random() * contracts.length);
                        winpercent = contracts[contractIndex].LastTradePrice * 100;
                        prediction += "You asked: ";
                        prediction += contracts[contractIndex].LongName;
                        prediction += " The chance for this to happen is  " + winpercent + " percent.";
                        criteria_met = true;
                        break;
                    }
                }
                if (!criteria_met)
                {
                    prediction = "I couldn't find any data on that! Sorry!";
                }
            }
            else if (slot_array.length == 2)
            {
                console.log("ParseContractForCongress Case 2: Searching for  control and = " + slot_array[0] + ", " + slot_array[1]);
                for (var i = 0; i < markets.length && !criteria_met; i++) // search through markets
                {
                        
                    contracts = markets[i].Contracts;
                    market_sn = markets[i].ShortName;
                    // console.log("Market ID = " + markets[i].ID + " ShortName = " + market_sn);

                    // go inside each contracts
                    for (var j = 0; j < contracts.length; j++)
                    {
                        ContractLongNameToLower = contracts[j].LongName.toLowerCase();
                        if ( (ContractLongNameToLower.search(slot_array[0].toLowerCase()) > -1 && 
                            ContractLongNameToLower.search(slot_array[1].toLowerCase()) > -1 ))
                        {
                            // Select random contract and respond
                            contractIndex = Math.floor(Math.random() * contracts.length);
                            winpercent = contracts[j].LastTradePrice * 100;
                            prediction += "You asked: ";
                            prediction += contracts[j].LongName;
                            prediction += " The chance for this to happen is  " + winpercent + " percent.";
                            criteria_met = true;
                            break;
                        }
                    }
                    
                }
                if (!criteria_met)
                {
                    prediction = "I couldn't find any data on that! Sorry!";
                }
            }
            else if (slot_array.length == 3)
            {
                console.log("ParseContractForCongress Case 3: Searching for  control and = " + 
                slot_array[0] + ", " + slot_array[1] + ", " + + slot_array[2]);
                for (var i = 0; i < markets.length && !criteria_met; i++) // search through markets
                {
                        
                    contracts = markets[i].Contracts;
                    market_sn = markets[i].ShortName;
                    // console.log("Market ID = " + markets[i].ID + " ShortName = " + market_sn);

                    // go inside each contracts
                    
                    for (var j = 0; j < contracts.length; j++)
                    {
                        ContractLongNameToLower = contracts[j].LongName.toLowerCase();
                        if ( (ContractLongNameToLower.search(slot_array[0].toLowerCase()) > -1 && 
                            ContractLongNameToLower.search(slot_array[1].toLowerCase()) > -1 &&
                            ContractLongNameToLower.search(slot_array[2].toLowerCase()) > -1 ))
                        {
                            // Select random contract and respond
                            contractIndex = Math.floor(Math.random() * contracts.length);
                            winpercent = contracts[j].LastTradePrice * 100;
                            prediction += "You asked: ";
                            prediction += contracts[j].LongName;
                            prediction += " The chance for this to happen is  " + winpercent + " percent.";
                            criteria_met = true;
                            break;
                        }
                    }
                    
                }
                if (!criteria_met)
                {
                    prediction = "I couldn't find any data on that! Sorry!";
                }
            }
            console.log("PREDICTION " + prediction);
            return prediction;
        }

        function WhoRunForWhitehouse (slot_array)
        {
            console.log("enter WhoRunForWhitehouse");
            
            var slot_lowercase = slot_array[0].toLowerCase()

            for (var i = 0; i < markets.length; i++) // search through markets
            {
                market_sn = markets[i].Name.toLowerCase();
                if ( (market_sn.search("president") > -1 && market_sn.search(slot_lowercase) > -1))
                {
                    console.log("Found Market ID = " + markets[i].ID + " ShortName = " + market_sn);
                    contracts = markets[i].Contracts;
                    console.log("contracts[0] is " + contracts[0]);
                    winpercent = contracts[0].LastTradePrice * 100;;
                    prediction += "According to Predict It, ";
                    prediction += " The chance for this to happen is  " + winpercent + " percent.";
                    criteria_met = true;
                    break;
                }
            }
            
            if (!criteria_met)
            {
                prediction = "I couldn't find any data on that! Sorry!";
            }
            return prediction;
        }

        function WhiteHouseNomination (slot_array)
        {
            console.log("enter WhiteHouseNomination");

            if (slot_array.length == 2)
            {
                var slot_lowercase1 = slot_array[0].toLowerCase()
                var slot_lowercase2 = slot_array[1].toLowerCase() 
                for (var i = 0; i < markets.length && !criteria_met; i++) // search through markets
                {
                    market_sn = markets[i].Name.toLowerCase();
                    if ( (market_sn.search("nomin") > -1 && market_sn.search(slot_lowercase1) > -1 
                        && market_sn.search(slot_lowercase2) > -1 ))
                    {
                        contracts = markets[i].Contracts;
                        winpercent = contracts[0].LastTradePrice * 100;;
                        prediction += "According to Predict It, ";
                        prediction += " The chance for this to happen is  " + winpercent + " percent.";
                        criteria_met = true;
                        break;
                    }

                    // search through contracts
                    contracts = markets[i].Contracts;
                    for (var j = 0; j < contracts.length && !criteria_met; j++)
                    {
                        ContractLongNameToLower = contracts[j].LongName.toLowerCase();
                        if ( ( market_sn.search("nomin") > -1 && 
                            ContractLongNameToLower.search(slot_array[0].toLowerCase()) > -1 && 
                            ContractLongNameToLower.search(slot_array[1].toLowerCase()) > -1 ))
                        {
                            // Select random contract and respond
                            contractIndex = Math.floor(Math.random() * contracts.length);
                            winpercent = contracts[j].LastTradePrice * 100;
                            prediction += "You asked: ";
                            prediction += contracts[j].LongName;
                            prediction += " The chance for this to happen is  " + winpercent + " percent.";
                            criteria_met = true;
                            break;
                        }
                    }
                }
            }
            if (!criteria_met)
            {
                prediction = "I couldn't find any data on that! Sorry!";
            }
            return prediction;
        }
        
        function RunningForCongress (slot_array)
        {
            console.log("enter RunningForCongress");
            
            if (slot_array.length == 2)
            {
                var slot_lowercase1 = slot_array[0].toLowerCase()
                var slot_lowercase2 = slot_array[1].toLowerCase() 
                for (var i = 0; i < markets.length && !criteria_met; i++) // search through markets
                {
                    market_sn = markets[i].Name.toLowerCase();
                    if ( (market_sn.search("run for congress ") > -1 && market_sn.search(slot_lowercase1) > -1 
                        && market_sn.search(slot_lowercase2) > -1 ))
                    {
                        contracts = markets[i].Contracts;
                        winpercent = contracts[0].LastTradePrice * 100;;
                        prediction += "According to Predict It, ";
                        prediction += " The chance for this to happen is  " + winpercent + " percent.";
                        criteria_met = true;
                        break;
                    }

                    // search through contracts
                    contracts = markets[i].Contracts;
                    for (var j = 0; j < contracts.length && !criteria_met; j++)
                    {
                        ContractLongNameToLower = contracts[j].LongName.toLowerCase();
                        if ( ( market_sn.search("run for congress") > -1 && 
                            ContractLongNameToLower.search(slot_array[0].toLowerCase()) > -1 && 
                            ContractLongNameToLower.search(slot_array[1].toLowerCase()) > -1 ))
                        {
                            // Select random contract and respond
                            contractIndex = Math.floor(Math.random() * contracts.length);
                            winpercent = contracts[j].LastTradePrice * 100;
                            prediction += "You asked: ";
                            prediction += contracts[j].LongName;
                            prediction += " The chance for this to happen is  " + winpercent + " percent.";
                            criteria_met = true;
                            break;
                        }
                    }
                }
            }
            if (!criteria_met)
            {
                prediction = "I couldn't find any data on that! Sorry!";
            }
            return prediction;
        }

        function NameReelection (slot_array)
        {
            console.log("enter NameReelection");
            
            if (slot_array.length == 2)
            {
                var slot_lowercase1 = slot_array[0].toLowerCase()
                var slot_lowercase2 = slot_array[1].toLowerCase() 
                for (var i = 0; i < markets.length && !criteria_met; i++) // search through markets
                {
                    market_sn = markets[i].Name.toLowerCase();
                    if ( (market_sn.search("elected") > -1 && market_sn.search(slot_lowercase1) > -1 
                        && market_sn.search(slot_lowercase2) > -1 ))
                    {
                        contracts = markets[i].Contracts;
                        winpercent = contracts[0].LastTradePrice * 100;;
                        prediction += "According to Predict It, ";
                        prediction += " The chance for this to happen is  " + winpercent + " percent.";
                        criteria_met = true;
                        break;
                    }

                    // search through contracts
                    contracts = markets[i].Contracts;
                    for (var j = 0; j < contracts.length && !criteria_met; j++)
                    {
                        ContractLongNameToLower = contracts[j].LongName.toLowerCase();
                        if ( ( market_sn.search("elected") > -1 && 
                            ContractLongNameToLower.search(slot_array[0].toLowerCase()) > -1 && 
                            ContractLongNameToLower.search(slot_array[1].toLowerCase()) > -1 ))
                        {
                            // Select random contract and respond
                            contractIndex = Math.floor(Math.random() * contracts.length);
                            winpercent = contracts[j].LastTradePrice * 100;
                            prediction += "You asked: ";
                            prediction += contracts[j].LongName;
                            prediction += " The chance for this to happen is  " + winpercent + " percent.";
                            criteria_met = true;
                            break;
                        }
                    }
                }
            }
            if (!criteria_met)
            {
                prediction = "I couldn't find any data on that! Sorry!";
            }
            return prediction;
        }
        
        function WhoImpeach (slot_array)
        {
            console.log("enter WhoImpeach");
            var slot_lowercase = slot_array[0].toLowerCase()
            for (var i = 0; i < markets.length; i++) // search through markets
            {
                market_sn = markets[i].Name.toLowerCase();
                if ( (market_sn.search("impeach") > -1 && market_sn.search(slot_lowercase) > -1))
                {
                    contracts = markets[i].Contracts;
                    winpercent = contracts[0].LastTradePrice * 100;;
                    prediction += "According to Predict It, ";
                    prediction += " The chance for this to happen is  " + winpercent + " percent.";
                    criteria_met = true;
                    break;
                }
            }
            if (!criteria_met)
            {
                prediction = "I couldn't find any data on that! Sorry!";
            }
            return prediction;
        }
        /* for (var i = 0; i < markets.length; i++)
        {
            console.log("market : " + i + "ID = " + markets[i].ID + " ShortName = " + markets[i].ShortName);
            contracts = markets[i].Contracts;
            for (var j = 0; j < contracts.length; j++)
            {
                console.log("___ Contracts : " + j + " LongName = " + contracts[j].LongName);
            }        
        } */
         
        let skillId, requestType, dialogState, intent ,intentName, intentConfirmationStatus, slotArray, slots, count,_this,  api_response, url;
        var slotValues = [];

        try {
            // PredictIt API url
            url = "http://aiprestageapi1.wintrade.com/APIV1/api/Browse/Search/trump tweet?page=1&itemsPerPage=3";
            _this = this;
            //Parse necessary data from JSON object using dot notation
            //build output strings and check for undefined
            skillId = this.event.session.application.applicationId;
            requestType = "The request type is, "+this.event.request.type+" .";
            dialogState = this.event.request.dialogState;
            intent = this.event.request.intent;

            // getting slot
            slots = "";
            count = 0;

            if (slotArray == undefined || slots == undefined) {
                slots = "";
            }
            
            slotArray = this.event.request.intent.slots;
            

            //Iterating through slot array
            for (let slot in slotArray) {
                count += 1;
                let slotName = slotArray[slot].name;
                let slotValue = slotArray[slot].value;
                // sanitize last character - it doesn't hurt to comparison too much
                if (slotValue != null)
                {
                    slotValue = slotValue.slice(0,-1); 
                    slotValues.push(slotValue);
                }
                let slotConfirmationStatus = slotArray[slot].confirmationStatus;
                slots = slots + "The <say-as interpret-as='ordinal'>"+count+"</say-as> slot is, " + slotName + ", its value is, " +slotValue;
                
                // UNBLOCK this if for dialog
                /******
                if (slotConfirmationStatus!= undefined && slotConfirmationStatus != "NONE") {
                  slots = slots+" and its confirmation status is "+slotConfirmationStatus+" . ";
                } else {
                  slots = slots+" . ";
                }******/
            }

            
            if (intent != undefined && count > 0) {
                // intentName = " The intent name is, "+this.event.request.intent.name+" .";
                intentName = this.event.request.intent.name;
                if (intentName == "WhoRunForWhitehouse")
                {
                    // call predict it API here for White House
                    // The following code is working as expected
                    /* api_response = "Calling PredictItWhitehouse...."
                    console.log("Calling PredictItWhitehouse....");
                    http.get(url, function(res) {
                        console.log("Got response: " + res.statusCode);
                        res.on("data", function(chunk) {
                            console.log("BODY: " + chunk);
                        });
                        callback(_this);
                       
                    }).
                    on('error', function(e) {
                        console.log("Got error: " + e.message);
                    }); */

                    alexa_response = WhoRunForWhitehouse(slotValues);
                    
                }
                if (intentName == "PartyControlCongress")
                {
                    // check slot param count
                    console.log("slotArray: " + slotValues);
                    alexa_response = ParseContractForCongress(slotValues);
                } 
                if (intentName == "WhiteHouseNomination")
                {
                    // check slot param count
                    console.log("slotArray: " + slotValues);
                    alexa_response = WhiteHouseNomination(slotValues);
                }
                if (intentName == "RunningForCongress")
                {
                    // check slot param count
                    console.log("slotArray: " + slotValues);
                    alexa_response = RunningForCongress(slotValues);
                }
                if (intentName == "NameReelection")
                {
                    // check slot param count
                    console.log("slotArray: " + slotValues);
                    alexa_response = NameReelection(slotValues);
                }
                if (intentName == "WhoImpeach")
                {
                    // check slot param count
                    console.log("slotArray: " + slotValues);
                    alexa_response = WhoImpeach(slotValues);
                }
                
                
                // UNBLOCK this if for dialog
                /******
                intentConfirmationStatus = this.event.request.intent.confirmationStatus;
                if (intentConfirmationStatus != "NONE" && intentConfirmationStatus != undefined ) {
                    intentConfirmationStatus = " and its confirmation status is "+ intentConfirmationStatus+" . ";
                    intentName = intentName+intentConfirmationStatus;
                }****/
            } else {
                const factArr = data;
                const factIndex = Math.floor(Math.random() * factArr.length);
                const randomFact = factArr[factIndex];
                const speechOutput = GET_FACT_MESSAGE + randomFact;
        
                this.response.cardRenderer(SKILL_NAME, randomFact);
                this.response.speak(speechOutput);
                this.emit(':responseReady');
            }

            

            //Delegate to Dialog Manager when needed
            //<reference to docs>
            if (dialogState == "STARTED" || dialogState == "IN_PROGRESS") {
              this.emit(":delegate");
            }
        } catch(err) {
            console.log("Error: " + err.message);
        }

        // let speechOutput = "Your end point received a request, here's a breakdown. " + requestType + " The intent name is: " + intentName + slots;
        let speechOutput = alexa_response;
        let cardTitle = "Skill ID: " + skillId;
        let cardContent = speechOutput;
        
        // If API is involved, then uncomment these lines
        // This works as expected
        /* function callback(param)
        {
            param.response.cardRenderer(cardTitle, cardContent);
            param.response.speak(speechOutput);
            param.emit(':responseReady');
        } */
        
        this.response.cardRenderer(cardTitle, cardContent);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
  }
};
