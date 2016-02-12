var user;

// password submission ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --
$("#TBD").click(function(){
    var formData = {
        email: $("#TBD").val(),
        password: $("#TBD").val()
    }
    $.post('/userLogin', formData, function(data){
      if(data){
         user = data;
      // redirect to new page if login succeeds
      var url = "http://www.mydomain.com/new-page.html";
      $( location ).attr("href", url);
      } else {
          $("#TBD").append("<p id='failedLogin' style='color:red'>Your login did not match. Please try again</p>");
          setTimeout($('#failedLogin').remove(), 2000);
      }   
    }); 
});

// new user registration ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --

$("#TBD").click(function(){
    //gathers user info into object
    var formData = {
        fName: $("#TBD").val(),
        lName: $("#TBD").val(),
        fullName: $("#TBD").val()+' '+$("#TBD").val(),
        email: $("#TBD").val(),
        password: $("#TBD").val(),
        userId:"",  
    }
    //posts object to server
    $.post('/newUser', formData, function(data){
        if(data){
         user = data;
      // redirect to new page if succeeds
      var url = "http://www.###############.com/new-page.html";
      $(location).attr("href", url);
      } else {
          $("#TBD").append("<p id='failedLogin' style='color:red'>This email is already a registered user.</p>");
          setTimeout($('#failedLogin').remove(), 2000);
      }
    });    
});


// Post question ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --

$("#TBD").click(function(){
    //gathers user info into object
    var formData = {
        qId: '',
        userId: user.userId,
        userName: user.fullName,
        subject: $("#TBD").val(),
        body: $("#TBD").val(),
        comment:[],
        userLiked:[]
    }
    //posts object to server
    $.post('/question', formData, function(data){
        if(data){
        //haven't built this function yet !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         constructQuestion(data);
      } else {
          $("#TBD").append("<p id='failedLogin' style='color:red'>Opps, something went wrong</p>");
          setTimeout($('#failedLogin').remove(), 2000);
      }
    });    
});


// Post comment ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

$("#TBD").click(function(){
    //gathers user info into object
    var formData = {
        qId: $(this).closest("some elemement with a certain class e.g 'div.questionHeader'").attr('id'),
        userId: user.userId,
        userName: user.fullName,
        content: $(this)closest('input').val(),
        likedCount: 0,
        commentId:"",
    }
    //posts object to server
    $.post('/comment', formData, function(data){
        if(data){
        //haven't built this function yet !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
        constructComment(data);
      } else {
          $(this).append("<p id='failedLogin' style='color:red'>Opps, something went wrong</p>");
          setTimeout($('#failedLogin').remove(), 2000);
      }
    });    
});

// like a question

$("#TBD").click(function(){
    //posts object to server
    $.get('/comment?id='+$(this).closest(".comment").attr("id"), function(data){
        $(this).closest(".count").text(data);
    });    
});