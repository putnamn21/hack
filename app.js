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

//opens unique id file
var uniqueId;
fs.readFile('uniqueId.txt', function (err, data) {
    if (err) {
        console.log(err);
        return
    }
    uniqueId = data;
});

//adding new question post event
app.post('/question', function (req, res) {
    console.log("question submitted")
    var question = req.body;
    question.userId = generateUniqueId();
    questions.push(question);
    saveQuestions();
    console.log("question successfully saved")
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
    console.log("made it into the create user function")
    var user = req.body;
    console.log(user);
    if (checkUniqueUsers(user)) {
        user.userId = generateUniqueId();
        users.push(user);
        saveUsers();
        console.log(user);
        res.send(user);
    } else {
        res.send(false)
    }
});

//login post event
app.post('/login', function (req, res) {
    var user = req.body;
    console.log(user);
    var index = validateUser(user);
    console.log(index);
    if (index == "false") {
         res.send(false)
    } else {
        console.log(users[index]);
        res.send(users[index]);
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

//saves users in file
function saveUsers() {
    fs.writeFile("userArray.txt", JSON.stringify(users), function (err) {
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
        console.log("looping");
        if (users[i].email == user.email && users[i].password == user.password) {
            myIndex = i;
            isValid = true;
            console.log(myIndex, "in validateUser function");
        }
    }
    if (isValid == true) {
        return myIndex;
    } else if (isValid == false) {
        return "false";
    }
};

app.get('/', function (req, res) {
    console.log("home page accessed")
    res.render("home", {
        question: questions
    });
});

app.get('/login', function (req, res) {
    console.log("home page accessed")
    res.render("login", {});
});
app.get('/register', function (req, res) {
    console.log("home page accessed")
    res.render("register", {});
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
