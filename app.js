var express = require('express');
var handlebars = require('express-handlebars');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//ignore above. this is just setup for express, handlebars, and bodyParser(bodyParser needed for the post)




// functions above read the tweet arrays out of flat storage

var tweetArray;

fs.readFile('tweetArray.txt', function (err, data) {
    if (err) {
        console.log(err);
        return
    }
    var a = JSON.parse(data);
    console.log("tweet array successfully loaded", a)
    tweetArray = a;
});

var tweetUniqueId; 

fs.readFile('tweetId.txt', function (err, data) {
    if (err) {
        console.log(err);
        return
    }
    var a = parseInt(data);
    console.log('tweet id start point successfully loaded', a)
    tweetUniqueId = a;
});;

//renders the page on the home screen load
app.get('/', function (req, res) {
    renderTweets(res);
});

function renderTweets(res) {
    res.render("home", {  
        tweets: tweetArray
    });
}






//Creates and displays a tweet!
app.post('/tweet', function (req, res) {
    console.log(req);
    var tweet = new Tweet(req.body.name, req.body.message, req.body.viewers)
    tweetArray.unshift(tweet);
    saveTweetArray();
    res.send(tweet);
});


// creates tweet objects
function Tweet(name, message, viewers) {
    this.id = tweetId();
    this.name = name;
    this.message = message;
    this.viewers = viewers;
    this.likedCount = 0;
}

//incriments the tweet id so that it always has a unique id
function tweetId() {
    if (tweetUniqueId == undefined) {
        tweetUniqueId = 0
    }
    tweetUniqueId++;
    fs.writeFile("tweetId.txt", tweetUniqueId, function(err){
        if(err) {console.log(err);} 
  else {
    console.log("tweet id saved to: tweetId.txt");
  }})
    return tweetUniqueId;
}

// saves tweet to flat file storage
function saveTweetArray(){
    fs.writeFile("tweetArray.txt", JSON.stringify(tweetArray), function(err) {
  if(err) {
        console.log(err);
  } 
  else {
    console.log("tweet array sucessfully updated in DB");
  }})
}

//increments liked count and then responds to the web page with that count - ajax request
app.get('/liked', function (req, res) {
    tweetIdentity = req.query.id;
    var responseText;
    for (var i = 0; i < tweetArray.length; i++) {
        if (tweetArray[i].id == tweetIdentity) {
            tweetArray[i].likedCount++;
            responseText = tweetArray[i].likedCount
        }
    }
    saveTweetArray();
    res.send(responseText.toString());
});









//delets the tweet out of our database
app.get('/delete', function (req, res) {
    tweetIdentity = req.query.id;
    for (var i = 0; i < tweetArray.length; i++) {
        if (tweetArray[i].id == tweetIdentity) {
            tweetArray.splice(i, 1)
        }
    }
    saveTweetArray();
    console.log('tweet'+tweetIdentity+'deleted')
    res.send("tweet "+ tweetIdentity +" deleted");
});





// ignore these

//allows the public folder to be viewable by the browser
app.use(express.static('public'));

//catch all for bad urls returning "page not found"
app.use(function (req, res, next) {
    res.status(404);
    res.send("404 page not found");
});

//local host port used
app.listen(3000, function () {
    console.log("Node running on port 3000")
});