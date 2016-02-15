var user = JSON.parse(sessionStorage.getItem("user"));

// login submission YAY ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --
function submitUserLogin(){
    var formData = {
        email: $("#signup_email").val(),
        password: $("#signup_password").val()
    }
    $.post('/login', formData, function(data){
      if(data){
          console.log(data);
         sessionStorage.setItem("user", JSON.stringify(data));
      // redirect to new page if login succeeds
      var url = "/";
     $( location ).attr("href", url);
      } else {
          $("#signup_forms_container").append("<p id='failedLogin' style='color:red'>Your login did not match. Please try again</p>");
          setTimeout($('#failedLogin').remove(), 2000);
      }   
    }); 
}

// new user registration ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --

function registerUser() {
    var formData;
    var firstPassword = $("#signup_confirm_password").val();
    var secondPassword = $("#signup_password").val();

    if (firstPassword == secondPassword) {
        //gathers user info into object
        formData = {
            fName: $("#signup_fName").val(),
            lName: $("#signup_lName").val(),
            fullName: $("#signup_fName").val() + ' ' + $("#signup_lName").val(),
            email: $("#signup_email").val(),
            password: $("#signup_confirm_password").val(),
            userId: ""
        }
    } else {
        $("#signup_confirm_password").append('<p style="color:red;" id="passwordsNoMatch">passwords did not match<p/>');
        setTimeout(function () {
            $('#passwordsNoMatch').remove()
        }, 2000);
    }
    console.log(formData);

    //posts object to server
    $.post('/createUser', formData, function (data) {
        if (data) {
            sessionStorage.setItem("user", JSON.stringify(data))
            //redirect to new page if succeeds
            var url = "/";
            $(location).attr("href", url);
        } else {
            $("#TBD").append("<p id='failedLogin' style='color:red'>This email is already a registered user.</p>");
            setTimeout(function () {
                $('#failedLogin').remove()
            }, 2000);
        }
    });

}


// Post question ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --

function submitQ(){
    //gathers user info into object
    var formData = {
        qId: '',
        userId: user.userId,
        userName: user.fullName,
        subject: $("#sel1").val(),
        body: $("#question-body").val(),
        comment:[],
        userLiked:[]
    }
    console.log(formData);
    //posts object to server
    $.post('/question', formData, function(data){
        if(data){
        //haven't built this function yet !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //constructQuestion(data);
        console.log("question Submitted")
      } else {
          $("#TBD").append("<p id='failedLogin' style='color:red'>Opps, something went wrong</p>");
          setTimeout($('#failedLogin').remove(), 2000);
      }
    });    
}


// Post comment ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

$("#submit-comment").click(function(){
    //gathers user info into object
    
    var formData = {
        commentId:"",
        qId: $(this).closest(".question").attr('id'),
        userId: user.userId,
        userName: user.fullName,
        content: $(this).closest('textarea').val(),
        commentCount: 0,
        commentId:"",
    }
    //posts object to server
    $.post('/comment', formData, function(data){
        if(data){
        //haven't built this function yet !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
        constructComment(data);
      } else {
          $(this).append("<p id='failedLogin' style='color:red'>Opps, something went wrong</p>");
          setTimeout(function(){$('#failedLogin').remove()}, 2000);
      }
    });    
});

// like a question --- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----- ---- ---- ---- ---- --

$("#glyphicon-heart").click(function(){
    var like = {
        qId: $(this).closest(".question").attr("id"),
        commentId: $(this).closest(".comment").attr("id"),
        userId: user.userId ,
    }
    
    //posts object to server
    $.post('/like', like, function(data){
        $(this).closest(".count").text(data);
    });    
});