$(document).ready(
function(){
                  $('.requestType').click(function(){
                                          var closestClass = "."+$(this).attr('id');
                                          var closestId = "#"+$(this).attr('id');
                                          $('.btn').removeClass('active');
                                          $('.btn').removeClass('btn-info');
                                          $(closestId).addClass('btn-info');
                                          $('.requestItem').hide();
                                          $(closestClass).fadeIn('fast');
                                          });
                  //document.addEventListener("deviceready",createDB,false);
});


function createDB(){
    try{
        if(!!window.openDatabase){
            var createDB = window.sqlitePlugin.openDatabase({name : "makDB"});
        } else {
            navigator.notification.alert("Local Database is not supported by the device");
        }
    } catch (error){
        console.log("ERROR:" + error.message);
    }
}