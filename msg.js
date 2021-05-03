const fetch = require("node-fetch");
var schedule = require('node-schedule');
var telegramBot = require('node-telegram-bot-api');

var token = '1657509121:AAGjJDv6NRT90Y1SfrkJD0M7CJZ75mXXsCg';
var bot = new telegramBot(token,{polling:true});
var chatId = [ 697827461, 595524041, 393454270 ]

var today = new Date(); 
var dd = today.getDate(); 
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear(); 
var today = dd+'-'+mm+'-'+yyyy;

var url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=796&date='+today;
//'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=307&date=02-05-2021'
//'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=796&date=02-05-2021'

schedule.scheduleJob('*/10 * * * *', () => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var msg = [];
            for (let hosp of data.centers){
                var hos = {name: hosp.name, avail: []};
                for (let ses of hosp.sessions){
                    var sess = {sDate: ses.date, capacity: ses.available_capacity};
                    hos.avail.push(sess);
                }
                msg.push(hos);
            }
            for (let i of msg){
                for (j of i.avail){
                    if(j.capacity > 0){
                        //console.log(i.name+" has "+j.capacity+" on "+j.sDate)
                        var print = i.name+" has "+j.capacity+" on "+j.sDate;
                        for (cI of chatId){
                            bot.sendMessage(cI,print);
                        }
                    }
                }
            }
        });
    //bot.sendMessage(chatId,"ldf varumm ellam sheri akkumm");
})
