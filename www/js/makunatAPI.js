/*
 * Functions API by Marck Litonjua Regio
 */
var id = Math.floor((Math.random() * 1000) + (Math.random() * 100));
var db;
var ret;
function makoy(){
    //Initialization
    //fsAccess();
    createDB();
    fireJquery();
}
//File System Handler
function fsAccess(){
    //call this function before any file system activity
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                             window.rootFS = fileSystem.root;
                             fs = window.rootFS;
                             generateFile();
                             }, gotError);
}
function generateFile(){
    window.rootFS.getFile("file.txt", {create:true, exclusive:false},
                          function(fileEntry){
                          fileEntry.createWriter(function(writer){
                                                 writer.seek(writer.length);
                                                 writer.write(xmlBuilder());
                                                 showAlert("File Generated");
                                                 }, gotError);
                          }, gotError);
}
function xmlBuilder(){
    var h = "Marck Regio"
    return h;
}
//Database Handler
function createDB(){
    db = window.openDatabase("eCopyDB","1.0","NestleEtravel",10485760);
    db.transaction(createTables, gotError, function(){ console.log("Db Created"); });
}
function createTables(tx){
    tx.executeSql('Create Table If Not Exists AccountHandler (id unique, lastname text, firstname text, middlename text, birthdate text, mobileno text, address text)');
}
function runSQL(queryString){
    //showAlert(queryString);
    db.transaction(function(tx){ tx.executeSql(queryString);
                   }, gotError, function(){ console.log("runSQL Successful"); });
}
function runSQLReturn(dbName,fields,whereClause){
    var queryString;
    if( dbName == "AccountHandler"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getAccountList, gotError);
                       }, function(){
                       $('.page1').removeClass('hidden').addClass('shown');
                       $('.open-panel').addClass('hidden');
                       }, function(){ console.log("runSQLReturn Successful"); });
    }
    
}
function getAccountList(tx, results){
    var fullname = results.rows.item(0)['firstname'] + " " + results.rows.item(0)['middlename'] + " " + results.rows.item(0)['lastname'];
    //showAlert("Welcome to E-Travel " + fullname);
    $('.page2').removeClass('hidden').addClass('shown');
    $('.requestorName').text(fullname);
}
//Error Handlers
function showAlert(alert){
    navigator.notification.alert(
                                 alert,
                                 function(){
                                 //console.log("Alert triggered");
                                 },
                                 'Nestle E-Travel',
                                 'Ok'
                                 );
}
function gotError(error){
    showAlert("Error: "+ error.message);
}
//Jquery Handler
function fireJquery(){
    $(document).ready(function(){
                      //runSQL("Delete from AccountHandler");
                      runSQLReturn("AccountHandler","*","");
                      $('.requestPage').click(function(){
                                              $('.page3').removeClass('hidden').addClass('shown');
                                              if ($('.page2').hasClass('shown')){
                                              $('.page2').removeClass('shown').addClass('hidden');
                                              }
                                              $('.backer').removeClass('hidden').addClass('shown');
                                              $('.backer').addClass('toPage2');
                                              });
                      $('.backer').click(function(){
                                         if($(this).hasClass('toPage2')){
                                         $('.page2').removeClass('hidden').addClass('shown');
                                         if ($('.page3').hasClass('shown')){
                                         $('.page3').removeClass('shown').addClass('hidden');
                                         }
                                         $('.backer').addClass('hidden').removeClass('shown');
                                         $('.backer').removeClass('toPage2');
                                         }
                                         });
                      //RequestTabs
                      $('.requestType').click(function(){
                                              var closestClass = "."+$(this).attr('id');
                                              var closestId = "#"+$(this).attr('id');
                                              $('.button').removeClass('active');
                                              $(closestId).addClass('active');
                                              $('.section').hide();
                                              $(closestClass+"Section").fadeIn();
                                             });
                      //RegisterUser
                      $('.newUserSubmit').click(function(){
                                                runSQL("Insert Into AccountHandler (id, lastname, firstname, middlename, birthdate, mobileno, address) Values \
                                                       ("+id+",'"+$('.lastname').val()+"','"+$('.firstname').val()+"','"+$('.middlename').val()+"', \
                                                       '"+$('.birthdate').val()+"','"+$('.mobile').val()+"','"+$('.address').val()+"')");
                                                runSQLReturn("AccountHandler","*","");
                                                });
                      });
}