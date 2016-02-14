var express = require('express');
var handlebars = require('express-handlebars');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
//ignore above. this is just setup for express, handlebars, and bodyParser(bodyParser needed for the post)


var questions;
//opens questions array file
fs.readFile('questionsArray.txt', function (err, data) {
    if (err) {
        console.log(err);
        return
    }
    questions = JSON.parse(data);
});

var users;
//opens user file
fs.readFile('userArray.txt', function (err, data) {
    if (err) {
        console.log(err);
        return
    }
    users = JSON.parse(data);
});

//adding new question post event
app.post('/question', function (req, res) {
    var question = req.body;
    question.userId = generateUniqueId();
    questions.push(question);
    saveQuestions();
    res.send(question);
});

//adding new comment post event
app.post('/addComment', function (req, res) {
    var newComment = req.body;
    newComment.commentId = generateUniqueId();
    questions[findQuestion(newComment.qId)].comment.push(newComment);
    saveQuestions();
    res.send(newComment);
});

//adding new like post event
app.post('/addLike', function (req, res) {

    var numOfLikes;
    var myIndex;
    var notLiked = true;
    var currentQ = req.body.qId;
    var currentC = req.body.commentId;
    var currentU = req.body.userId;
    var questionIndex = findQuestion(currentQ);
    var currentULA = questions[questionIndex].userLiked //userLiked array for specific question

    for (var i = 0; i < questions[questionIndex].comment.length; i++) {
        if (currentC == questions[questionIndex].comment[i].commentId) {
            myIndex = i;
        }
    }

    for (var i = 0; i < currentULA.length; i++) {
        if (currentULA[i] == currentU) {
            notLiked = false;
        }
    }

    if (notLiked) {
        currentULA.push(currentU);
        questions[questionIndex].userLiked = currentULA;
        questions[questionIndex].comment[myIndex].likedCount += 1;
    }
    saveQuestions();
    res.send(questions[questionIndex].comment[myIndex].likedCount);
});

//adding  new user post event
app.post('/createUser', function (req, res) {
    var user = req.body;
    if (checkUniqueUsers(user)) {
        user.userId = generateUniqueId();
        users.push(user);
        saveUsers();
        res.send(user);
    } else {
        res.send(false)
    }
});

//login post event
app.post('/login', function (req, res) {
    var user = req.body;
    if (validateUser(user)) {
        res.send(users[myIndex]);
    } else {
        res.send(false)
    }
});

//generates uniqueid
function generateUniqueId() {
    uniqueId++;
    fs.writeFile("uniqueId.txt", uniqueId, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("uniqueId id saved to: uniqueId.txt");
        }
    })
    return uniqueId;
}

//given question id finds position of given question in question array
function findQuestion(questionId) {
    var myIndex;
    for (var i = 0; i < questions.length; i++) {
        if (questionId == questions[i].qId) {
            myIndex = i;
        }
    }
    return myIndex;
}

//saves questions in file
function saveQuestions() {
    fs.writeFile("questionsArray.txt", JSON.stringify(questions), function (err) {
        if (err) {
            console.log(err)
            return;
        } else {
            console.log("questions saved succesfully");
        }
    })
}

//checks to see that given user email doesn't already exist in users array
function checkUniqueUsers(newUserObject) {
    var isUnique = true;
    //function that reads from filestorage and returns the array of users
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == newUserObject.email) {
            isUnique = false;
        }
    }
    return isUnique;
}

//checks that given email and password matches what it is users array
function validateUser(user) {
    //function that reads from filestorage and returns the array of users
    var myIndex;
    var isValid = false;
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == user.body.email && users[i].password == user.body.password) {
            myIndex = i;
            isValid = true;
        }
    }
    if (isValid == true) {
        return myIndex;
    } else if (isValid == false) {
        return false;
    }
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
