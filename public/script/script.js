var user = localStorage.getItem(JSON.parse("user"))
if(user == undefined){
    console.log("undefined!!!")
   //dget(<FORM ID>).style.display = "block"; 
}

$('#<FORM ID>').submit(function(event) {
        var formData = {
            'name'              : $('input[name=name]').val(),
            'message'             : $('textarea[name=message]').val(),
            'viewers'    : $('select[name=viewers]').val()
        };
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '+++++++++++++++', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
                        encode          : true
        })
            .done(function(data) {
                saveUser(data);
            });
        event.preventDefault();
        $('#<FORM ID>').css("display", "none");
    });


function saveUser(data){
    localStorage.setItem("user", JSON.stringify(data))
}






































// function get value of html ID
function dget (id) {
    return(document.getElementById(id))
}
function submit (){
    var a = dget("test");
    alert(a);
}
