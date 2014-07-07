/*
 * Developed By: Marck Litonjua Regio
 */
var db;
var planeRequests = [];
var hotelRequests = [];
var carRequests = [];
var regRequests = [];
var otherRequests = [];
function makoy(){
    //Initialization
    //fsAccess();
    createDB();
    fireJquery();
}
//File System Handlers
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
    window.rootFS.getFile(Math.uuid()+".xml", {create:true, exclusive:false},
                          function(fileEntry){
                          fileEntry.createWriter(function(writer){
                                                 writer.seek(writer.length);
                                                 writer.write(xmlBuilder());
                                                 showAlert("File Generated");
                                                 }, gotError);
                          }, gotError);
}
function xmlBuilder(){
    var plane = "";
    for (var i = 0; i < planeRequests.length; i++){
        plane += planeRequests[i];
    }
    
    var xmlFile = '\
    <?xml version="1.0" encoding="UTF-8"?> \
    <Nestle> \
        <Request> \
            <referenceNo>' + $('.referenceNo').text() + '</referenceNo> \
            <requestor>' + $('.requestorName').text() + '</requestor> \
            <activityDate>' + $('.activityDate').val() + '</activityDate> \
            <activityName>' + $('.activityName').val() + '</activityName> \
            <accountNo>' + $('.accountNo').val() + '</accountNo> \
            <costCenter>' + $('.costCenter').val() + '</costCenter> \
        </Request> \
        ' + plane + ' \
    </Nestle>';
    return xmlFile;
}
//Database Handlers
function createDB(){
    db = window.openDatabase("eCopyDB","1.0","NestleEtravel",10485760);
    db.transaction(createTables, gotError, function(){ console.log("Db Created"); });
}
function createTables(tx){
    tx.executeSql('Create Table If Not Exists AccountHandler (id integer primary key autoincrement, lastname VARCHAR(255), firstname VARCHAR(255), middlename VARCHAR(255), birthdate VARCHAR(255), mobileno VARCHAR(255), address VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists MainTableActivityName (id integer primary key autoincrement, activityName VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists MainTableAccountNo(id integer primary key autoincrement, accountNumber VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists MainTableCostCenter (id integer primary key autoincrement, costCenter VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists PlaneTableAirline (id integer primary key autoincrement, airline VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists HotelTableLocation (id integer primary key autoincrement, location VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists HotelTableRoomType (id integer primary key autoincrement, roomType VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists HotelTableRoomCategory (id integer primary key autoincrement, roomCategory VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists CarTableDescription (id integer primary key autoincrement, description VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists CarTableDuration (id integer primary key autoincrement, duration VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists CarTableDetails (id integer primary key autoincrement, details VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists Passenger (id integer primary key autoincrement, name VARCHAR(255), mobile VARCHAR(255), address VARCHAR(255))');
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
    } else if( dbName == "Passenger"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getPassengerList, gotError);
                       }, function(){ console.log("Cannot Load Passengers");
                       }, function(){ console.log("runSQLReturn Successful"); });
    } else if( dbName == "PlaneTableAirline"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getPlaneList, gotError);
                       }, function(){ console.log("Cannot Load Plane List");
                       }, function(){ console.log("runSQLReturn Successful"); });
    } else if( dbName == "HotelTableLocation"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getLocationList, gotError);
                       }, function(){ console.log("Cannot Load Plane List");
                       }, function(){ console.log("runSQLReturn Successful"); });
    } else if( dbName == "HotelTableRoomType"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getRoomTypeList, gotError);
                       }, function(){ console.log("Cannot Load Plane List");
                       }, function(){ console.log("runSQLReturn Successful"); });
    } else if( dbName == "HotelTableRoomCategory"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getRoomCategoryList, gotError);
                       }, function(){ console.log("Cannot Load Plane List");
                       }, function(){ console.log("runSQLReturn Successful"); });
    } else if( dbName == "CarTableDescription"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getCarDescriptionList, gotError);
                       }, function(){ console.log("Cannot Load Plane List");
                       }, function(){ console.log("runSQLReturn Successful"); });
    } else if( dbName == "CarTableDuration"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getCarDurationList, gotError);
                       }, function(){ console.log("Cannot Load Plane List");
                       }, function(){ console.log("runSQLReturn Successful"); });
    } else if( dbName == "CarTableDetails"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getCarDetailsList, gotError);
                       }, function(){ console.log("Cannot Load Plane List");
                       }, function(){ console.log("runSQLReturn Successful"); });
    } else if( dbName == "MainTableAccountNo"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getAccountNumberList, gotError);
                       }, function(){ console.log("Cannot Load Plane List");
                       }, function(){ console.log("runSQLReturn Successful"); });
    } else if( dbName == "MainTableActivityName"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getActivityNameList, gotError);
                       }, function(){ console.log("Cannot Load Plane List");
                       }, function(){ console.log("runSQLReturn Successful"); });
    } else if( dbName == "MainTableCostCenter"){
        queryString = "Select " + fields + " from " + dbName + whereClause;
        db.transaction(function(tx){
                       tx.executeSql(queryString,[], getCostCenterList, gotError);
                       }, function(){ console.log("Cannot Load Plane List");
                       }, function(){ console.log("runSQLReturn Successful"); });
    }
    
}
function getAccountList(tx, results){
    var fullname = results.rows.item(0)['firstname'] + " " + results.rows.item(0)['middlename'] + " " + results.rows.item(0)['lastname'];
    //showAlert("Welcome to E-Travel " + fullname);
    $('.page2').removeClass('hidden').addClass('shown');
    $('.requestorName').text(fullname);
}
function getPassengerList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['name'];
        $('.planePassenger').append('<option value="' + dt + '">' + dt + '</option>');
        $('.hotelGuest').append('<option value="' + dt + '">' + dt + '</option>');
        $('.carPassenger').append('<option value="' + dt + '">' + dt + '</option>');
        $('.hcpReg').append('<option value="' + dt + '">' + dt + '</option>');
        $('.hcpOther').append('<option value="' + dt + '">' + dt + '</option>');
        }
}
function getPlaneList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['airline'];
        $('.preferredAirlineFlyin').append('<option value="' + dt + '">' + dt + '</option>');
        $('.preferredAirlineFlyout').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getLocationList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['location'];
        $('.hotelLocation').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getRoomTypeList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['roomType'];
        $('.roomType').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getRoomCategoryList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['roomCategory'];
        $('.roomCategory').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getCarDescriptionList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['description'];
        $('.carDescription').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getCarDetailsList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['details'];
        $('.carDetails').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getCarDurationList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['duration'];
        $('.carDuration').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getAccountNumberList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['accountNumber'];
        $('.accountNo').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getActivityNameList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['activityName'];
        $('.activityName').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getCostCenterList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['costCenter'];
        $('.costCenter').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
//Array Handlers
function processPlaneEntry(){
    var index = planeRequests.length;
    var planeXML = '\
    <PlaneRequest>  \
        <title>' + $('.titlePassenger').val() + '</title> \
        <planePassenger>' + $('.planePassenger').val() + '</planePassenger> \
        <typeFlyin>' + $('.flightTypeFlyin').val() + '</typeFlyin> \
        <preferredFlyin>' + $('.preferredAirlineFlyin').val() + '</preferredFlyin> \
        <flightNoFlyin>' + $('.flightNoFlyin').val() + '</flightNoFlyin> \
        <etdFlyin>' + $('.etdFlyin').val() + '</etdFlyin> \
        <dateFlyin>' + $('.dateFlyin').val() + '</dateFlyin> \
        <typeFlyout>' + $('.flightTypeFlyout').val() + '</typeFlyout> \
        <preferredFlyout>' + $('.preferredAirlineFlyout').val() + '</preferredFlyout> \
        <flightNoFlyout>' + $('.flightNoFlyout').val() + '</flightNoFlyout> \
        <etdFlyout>' + $('.etdFlyout').val() + '</etdFlyout> \
        <dateFlyout>' + $('.dateFlyout').val() + '</dateFlyout> \
    </PlaneRequest>';
    //Store to Array
    planeRequests[index] = planeXML;
}
function processHotelEntry(){
    var index = hotelRequests.length;
    var hotelXML = '\
    <HotelRequest> \
        <guestName>' + $('.hotelGuest').val() + '</guestName> \
        <hotel>' + $('.preferredHotel').val() + '</hotel> \
        <location>' + $('.hotelLocation').val() + '</location> \
        <roomType>' + $('.roomType').val() + '</roomType> \
        <roomCategory>' + $('.roomCategory').val() + '</roomCategory> \
        <checkin>' + $('.checkInDate').val() + '</checkin> \
        <checkout>' + $('.checkOutDate').val() + '</checkout> \
        <roomNights>' + $('.roomNights').val() + '</roomNights> \
    </HotelRequest>';
    //Store to Array
    //hotelRequests[index] = hotelXML;
}
function processCarEntry(){
    var index = carRequests.length;
    var carXML = '\
    <CarRequest> \
        <carPassenger>' + $('.carPassenger').val() + '</carPassenger> \
        <pickupTime>' + $('.pickUpTime').val() + '</pickupTime> \
        <pickupDate>' + $('.pickUpDate').val() + '</pickupDate> \
        <pickupPlace>' + $('.pickUpPlace').val() + '</pickupPlace> \
        <destination>' + $('.destination').val() + '</destination> \
        <paxNo>' + $('.paxNo').val() + '</paxNo> \
        <description>' + $('.carDescription').val() + '</description> \
        <duration>' + $('.carDuration').val() + '</duration> \
        <details>' + $('.carDetails').val() + '</details> \
    </CarRequest>';
    //Store to Array
    //carRequests[index] = carXML;
}
function processRegEntry(){
    var index = regRequests.length;
    var regXML = '\
    <RegRequest> \
        <hcpReg>' + $('.hcpReg').val() + '</hcpReg> \
        <prcNo>' + $('.prcNo').val() + '</prcNo> \
        <mailing>' + $('.mailingAddress').val() + '</mailing> \
        <emailAddress>' + $('.emailAddress').val() + '</emailAddress> \
        <membership>' + $('.membership').val() + '</membership> \
    </RegRequest>';
    //Store to Array
    //regRequests[index] = regXML;
}
function processOtherEntry(){
    var index = otherRequests.length;
    var otherXML = '\
    <OtherRequest> \
        <hcpOther>' + $('.hcpOther').val() + '</hcpOther> \
        <mobileOther>' + $('.otherMobile').val() + '</mobileOther> \
        <remarks>' + $('.remarks').val() + '</remarks> \
    </OtherRequest>';
    //Store to Array
    //otherRequests[index] = otherXML;
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
//Jquery Handlers
function fireJquery(){
    $(document).ready(function(){
                      //runSQL("Delete from AccountHandler");
                      //Load Maintenance
                      runSQLReturn("AccountHandler","*","");
                      runSQLReturn("Passenger", "*", "");
                      runSQLReturn("MainTableAccountNo","*","");
                      runSQLReturn("MainTableActivityName","*","");
                      runSQLReturn("MainTableCostCenter","*","");
                      runSQLReturn("PlaneTableAirline", "*", "");
                      runSQLReturn("HotelTableLocation","*","");
                      runSQLReturn("HotelTableRoomType","*","");
                      runSQLReturn("HotelTableRoomCategory","*","");
                      runSQLReturn("CarTableDescription","*","");
                      runSQLReturn("CarTableDetails","*","");
                      runSQLReturn("CarTableDuration","*","");
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
                                                runSQL("Insert Into AccountHandler (lastname, firstname, middlename, birthdate, mobileno, address) Values \
                                                       ('"+$('.lastname').val()+"','"+$('.firstname').val()+"','"+$('.middlename').val()+"', \
                                                       '"+$('.birthdate').val()+"','"+$('.mobile').val()+"','"+$('.address').val()+"')");
                                                runSQLReturn("AccountHandler","*","");
                                                });
                      //Tables
                      $('.planeSave').click(function(){
                                            var item = $('.addedPlaneRequest tr').size();
                                            $('.addedPlaneRequest').append('<tr class="selectedRow">\
                                                                           <td>' + item + '</td> \
                                                                           <td>' + $('.preferredAirlineFlyin').val() + '</td> \
                                                                           <td>' + $('.planePassenger').val() + '</td> \
                                                                           </tr>');
                                            processPlaneEntry();
                                            });
                      $('.hotelSave').click(function(){
                                            var item = $('.addedHotelRequest tr').size();
                                            $('.addedHotelRequest').append('<tr class="selectedRow">\
                                                                           <td>' + item + '</td> \
                                                                           <td>' + $('.preferredHotel').val() + '</td> \
                                                                           <td>' + $('.hotelGuest').val() + '</td> \
                                                                           </tr>');
                                            processHotelEntry();
                                            });
                      $('.carSave').click(function(){
                                          var item = $('.addedCarRequest tr').size();
                                          $('.addedCarRequest').append('<tr class="selectedRow">\
                                                                       <td>' + item + '</td> \
                                                                       <td>' + $('.destination').val() + '</td> \
                                                                       <td>' + $('.carPassenger').val() + '</td> \
                                                                       </tr>');
                                          processCarEntry();
                                          });
                      $('.regSave').click(function(){
                                          var item = $('.addedRegRequest tr').size();
                                          $('.addedRegRequest').append('<tr class="selectedRow">\
                                                                       <td>' + item + '</td> \
                                                                       <td>' + $('.prcNo').val() + '</td> \
                                                                       <td>' + $('.hcpReg').val() + '</td> \
                                                                       </tr>');
                                          processRegEntry();
                                          });
                      $('.otherSave').click(function(){
                                            var item = $('.addedOtherRequest tr').size();
                                            $('.addedOtherRequest').append('<tr class="selectedRow">\
                                                                           <td>' + item + '</td> \
                                                                           <td>' + $('.hcpOther').val() + '</td> \
                                                                           <td>' + $('.otherType').val() + '</td> \
                                                                           <td>' + $('.remarks').val() + '</td> \
                                                                           </tr>');
                                            processOtherEntry();
                                            });
                      $('.newRequestSubmit').click(function(){
                                                   fsAccess();
                                                   });
                      });

}