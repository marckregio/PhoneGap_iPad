$(document).ready(
function(){
                  $('#requestType').change(function(){
                                           var request = $('#requestType').val();
                                           $('.requestItem').hide();
                                           $('.'+ request).fadeIn('fast');
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