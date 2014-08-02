/*
 * Developed By: Marck Litonjua Regio
 */
var db;
var planeRequests = [];
var hotelRequests = [];
var carRequests = [];
var regRequests = [];
var otherRequests = [];
var dateJSON = new Date().toJSON();
var currentDate = dateJSON.slice(0, 10);
var rand ;
var referenceFile = currentDate+"-"+rand;
var ifPlanned = true;
function makoy(){
    //Initialization
    //fsAccess();
    createDB();
    fireJquery();
    window.plugin.email.isServiceAvailable(
                                           function (isAvailable) {
                                           showAlert("Email Composer not working for now");
                                           }
                                           );
}
function reset(){
    rand = Math.floor((Math.random() * 100) + 1);
    $('.referenceNo').text(currentDate+"-"+rand);
    $('select').val("");
    $('.selector option').remove();
    $('.selector').append('<option value="">Select an item</option>');
    $('input[type="text"]').val("");
    $('input[type="date"]').val(currentDate);
    planeRequests = [];
    hotelRequests = [];
    carRequests = [];
    regRequests = [];
    otherRequests = [];
    $('.addedPlaneRequest tr').remove();
    $('.addedCarRequest tr').remove();
    $('.addedHotelRequest tr').remove();
    $('.addedRegRequest tr').remove();
    $('.addedOtherRequest tr').remove();
    $('.newRequestSubmit').removeClass('disable');
    
    loadDropdowns();
}
function deleteDB(){
    runSQL("Delete from MainTableAccountNo");
    runSQL("Delete from MainTableActivityName");
    runSQL("Delete from MainTableCostCenter");
    runSQL("Delete from PlaneTableAirline");
    runSQL("Delete from HotelTableLocation");
    runSQL("Delete from HotelTableRoomType");
    runSQL("Delete from HotelTableRoomCategory");
    runSQL("Delete from CarTableDescription");
    runSQL("Delete from CarTableDuration");
    runSQL("Delete from CarTableDetails");
    runSQL("Delete from Passengers");
}
function loadDropdowns(){
    authUser("AccountHandler","*","");
    dropDownData("Passengers", "*", "");
    dropDownData("MainTableAccountNo","*","");
    dropDownData("MainTableActivityName","*","");
    dropDownData("MainTableCostCenter","*","");
    dropDownData("PlaneTableAirline", "*", "");
    dropDownData("HotelTableLocation","*","");
    dropDownData("HotelTableRoomType","*","");
    dropDownData("HotelTableRoomCategory","*","");
    dropDownData("CarTableDescription","*","");
    dropDownData("CarTableDetails","*","");
    dropDownData("CarTableDuration","*","");
}
//File System Handlers
function fsAccess(method){
    //call this function before any file system activity
    if (method == "NewRequest"){
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                                 window.rootFS = fileSystem.root;
                                 fs = window.rootFS;
                                 generateFile();
                                 }, gotError);
    } else if (method == "UpdateDatabase"){
        /*window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                                 window.rootFS = fileSystem.root;
                                 fs = window.rootFS;
                                 readFile();
                                 }, gotError);*/
        readFile();
        //deleteDB();
    }
}
function generateFile(){
    window.rootFS.getFile(Math.uuid()+".xml", {create:true, exclusive:false},
                          function(fileEntry){
                          fileEntry.createWriter(function(writer){
                                                 writer.seek(writer.length);
                                                 writer.write(xmlBuilder());
                                                 console.log("File Generated");
                                                 }, gotError);
                          }, gotError);
}
function readFile(){
    //deleteDB();
    $.get("https://1493af446944a2a7b5f7146dcc42eee008910ced.googledrive.com/host/0B2i9Gaj9Iy0_eGh5Tm9objNXSGM/nestleDB.xml",
          function(rawXML){
          var xml = $(rawXML);
          deleteDB();
          xml.find("PassengerDetails").find("passenger").each(function(){
                                                          //showAlert($(this).text());
                                                          runSQL("Insert into Passengers (name, address, mobile, birthdate) Values ('" + $(this).find("name").text() + "','" + $(this).find("hcpid").text()+ "','" + $(this).find("mobileno").text()+ "','" + $(this).find("birthdate").text()+ "')");
                                                          });
          xml.find("AccountNumbers").find("account").each(function(){
                                                          //showAlert($(this).text());
                                                          runSQL("Insert into MainTableAccountNo (accountNumber) Values ('" + $(this).text() + "')");
                                                          });
          xml.find("CostCenters").find("cost").each(function(){
                                                    //showAlert($(this).text());
                                                    runSQL("Insert into MainTableCostCenter (costCenter) Values ('" + $(this).text() + "')");
                                                    });
          xml.find("ActivityNames").find("activity").each(function(){
                                                         //showAlert($(this).text());
                                                         runSQL("Insert into MainTableActivityName (activityName) Values ('" + $(this).text() + "')");
                                                         });
          xml.find("Airlines").find("airline").each(function(){
                                                    //showAlert($(this).text());
                                                    runSQL("Insert into PlaneTableAirline (airline) Values ('" + $(this).text() + "')");
                                                    });
          xml.find("Locations").find("location").each(function(){
                                                      //showAlert($(this).text());
                                                      runSQL("Insert into HotelTableLocation (location) Values ('" + $(this).text() + "')");
                                                      });
          xml.find("RoomTypes").find("roomtype").each(function(){
                                                      //showAlert($(this).text());
                                                      runSQL("Insert into HotelTableRoomType (roomType) Values ('" + $(this).text() + "')");
                                                      });
          xml.find("RoomCategories").find("roomcategory").each(function(){
                                                               //showAlert($(this).text());
                                                               runSQL("Insert into HotelTableRoomCategory (roomCategory) Values ('" + $(this).text() + "')");
                                                               });
          xml.find("CarDescriptions").find("cardescription").each(function(){
                                                                  //showAlert($(this).text());
                                                                  runSQL("Insert into CarTableDescription (description) Values ('" + $(this).text() + "')");
                                                                  });
          xml.find("CarDurations").find("carduration").each(function(){
                                                            //showAlert($(this).text());
                                                            runSQL("Insert into CarTableDuration (duration) Values ('" + $(this).text() + "')");
                                                            });
          xml.find("CarDetails").find("cardetail").each(function(){
                                                         //showAlert($(this).text());
                                                         runSQL("Insert into CarTableDetails (details) Values ('" + $(this).text() + "')");
                                                         });
          console.log("XML Fetched!");
          }).fail(function(){
                  showAlert("Can't Update Database \n No Database File Found \n Please Try Again");
                  });
}
function xmlBuilder(){
    var plane = "";
    for (var i = 0; i < planeRequests.length; i++){
        plane += planeRequests[i];
    }
    var hotel = "";
    for (var i = 0; i < hotelRequests.length; i++){
        hotel += hotelRequests[i];
    }
    var car = "";
    for (var i = 0; i < carRequests.length; i++){
        car += carRequests[i];
    }
    var reg = "";
    for (var i = 0; i < regRequests.length; i++){
        reg += regRequests[i];
    }
    var other = "";
    for (var i = 0; i < otherRequests.length; i++){
        other += otherRequests[i];
    }
    
    var activityName = "";
    if ($('#activityName').val() == "Other"){ activityName = $('.otheractivityName').val(); ifPlanned = false; } else { activityName = $('#activityName').val(); }
    var accountNo = "";
    if ($('#accountNo').val() == "Other"){ accountNo = $('.otheraccountNo').val(); } else { accountNo = $('#accountNo').val(); }
    var costCenter = "";
    if ($('#costCenter').val() == "Other"){ costCenter = $('.othercostCenter').val(); } else { costCenter = $('#costCenter').val(); }
    //            <justification>' + $('.justification').val() + '</justification>
    var xmlFile = '<?xml version="1.0" encoding="UTF-8"?> \
    <!--\
    Generated XML using iPad Application \
    Unauthorized use of this file is prohibited \
    if found elsewhere, Delete Immediately \
    --> \
    <Nestle> \
        <Request> \
            <referenceNo>' + $('.referenceNo').text() + '</referenceNo> \
            <requestor>' + $('.requestorName').text() + '</requestor> \
            <activityDate>' + $('.activityDate').val() + '</activityDate> \
            <activityName>' + activityName + '</activityName> \
            <accountNo>' + accountNo + '</accountNo> \
            <costCenter>' + costCenter + '</costCenter> \
        </Request> \
        ' + plane + ' \
        ' + hotel + ' \
        ' + car + ' \
        ' + reg + ' \
        ' + other + ' \
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
    tx.executeSql('Create Table If Not Exists Passengers (id integer primary key autoincrement, name VARCHAR(255), mobile VARCHAR(255), address VARCHAR(255), birthdate VARCHAR(255) )');
}
function runSQL(queryString){
    //showAlert(queryString);
    db.transaction(function(tx){ tx.executeSql(queryString);
                   }, gotError, function(){ console.log("runSQL Successful"); });
}
function authUser(dbName,fields,whereClause){
    queryString = "Select " + fields + " from " + dbName + whereClause;
    db.transaction(function(tx){
                   tx.executeSql(queryString,[], getAccountList, gotError);
                   }, function(){
                   $('#registrationPage').removeClass('hidden').addClass('shown');
                   $('.open-panel').addClass('hidden');
                   }, function(){ console.log("runSQLReturn Successful"); });
}
function dropDownData(dbName,fields,whereClause){
    var queryString = "Select " + fields + " from " + dbName + whereClause;
    db.transaction(function(tx){
                   tx.executeSql(queryString,[], eval('get'+dbName+'List'), gotError);
                   }, function(){ console.log("Cannot Load Dropdown");
                   }, function(){ console.log("runSQLReturn Successful"); });
}
function getDetails(forList, name){
    var queryString = "Select * from Passengers Where name = '" + name + "'";
    db.transaction(function(tx){
                   tx.executeSql(queryString,[], eval(forList), gotError);
                   }, function(){ console.log("Cannot Load For List");
                   }, function(){ console.log("runSQLReturn Successful"); });
}
function getAccountList(tx, results){
    var fullname = results.rows.item(0)['firstname'] + " " + results.rows.item(0)['middlename'] + " " + results.rows.item(0)['lastname'];
    //showAlert("Welcome to E-Travel " + fullname);
    $('#menuPage').removeClass('hidden').addClass('shown');
    pageController('menuPage');
    $('.requestorName').text(fullname);
    $('.requestorWelcome').text(fullname);
    $('.emailFrom').val(results.rows.item(0)['address']);
}
function getPassengersList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['name'];
        $('#planePassenger').append('<option value="' + dt + '">' + dt + '</option>');
        $('#hotelGuest').append('<option value="' + dt + '">' + dt + '</option>');
        $('#carPassenger').append('<option value="' + dt + '">' + dt + '</option>');
        $('#hcpReg').append('<option value="' + dt + '">' + dt + '</option>');
        $('#hcpOther').append('<option value="' + dt + '">' + dt + '</option>');
        }
}
function getPlaneTableAirlineList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['airline'];
        $('#preferredAirlineFlyin').append('<option value="' + dt + '">' + dt + '</option>');
        $('#preferredAirlineFlyout').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getHotelTableLocationList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['location'];
        $('#hotelLocation').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getHotelTableRoomTypeList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['roomType'];
        $('#roomType').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getHotelTableRoomCategoryList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['roomCategory'];
        $('#roomCategory').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getCarTableDescriptionList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['description'];
        $('#carDescription').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getCarTableDetailsList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['details'];
        $('#carDetails').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getCarTableDurationList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['duration'];
        $('#carDuration').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getMainTableAccountNoList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['accountNumber'];
        $('#accountNo').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getMainTableActivityNameList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['activityName'];
        $('#activityName').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getMainTableCostCenterList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['costCenter'];
        $('#costCenter').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function planePassengerDetails(tx, results){
    $('.planehcpId').val(''+results.rows.item(0)['address']);
    $('.planeBirthdate').val(''+results.rows.item(0)['birthdate']);
    $('.planeMobileNo').val(''+results.rows.item(0)['mobile']);
}
function hotelGuestDetails(tx, results){
    $('.hotelhcpId').val(''+results.rows.item(0)['address']);
    $('.hotelBirthdate').val(''+results.rows.item(0)['birthdate']);
    $('.hotelMobileNo').val(''+results.rows.item(0)['mobile']);
}
function carPassengerDetails(tx, results){
    $('.carhcpId').val(''+results.rows.item(0)['address']);
    $('.carBirthdate').val(''+results.rows.item(0)['birthdate']);
    $('.carMobileNo').val(''+results.rows.item(0)['mobile']);
}
function hcpRegDetails(tx, results){
    $('.reghcpId').val(''+results.rows.item(0)['address']);
    $('.regBirthdate').val(''+results.rows.item(0)['birthdate']);
    $('.regMobileNo').val(''+results.rows.item(0)['mobile']);
}
function hcpOtherDetails(tx, results){
    $('otherhcpId').val(''+results.rows.item(0)['address']);
    $('.otherBirthdate').val(''+results.rows.item(0)['birthdate']);
    //$('.otherMobileNo').val(''+results.rows.item(0)['mobile']);
}
//Array Handlers
function processPlaneEntry(){
    var index = planeRequests.length;
    
    var planePassenger = "";
    if ($('#planePassenger').val() == "Other"){ planePassenger = $('.otherplanePassenger').val(); } else { planePassenger = $('#planePassenger').val(); }
    var preferredAirlineFlyin = "";
    if ($('#preferredAirlineFlyin').val() == "Other"){ preferredAirlineFlyin = $('.otherAirlineFlyin').val(); } else { preferredAirlineFlyin = $('#preferredAirlineFlyin').val(); }
    var preferredAirlineFlyout = "";
    if ($('#preferredAirlineFlyout').val() == "Other"){ preferredAirlineFlyout  = $('.otherAirlineFlyout').val(); } else { preferredAirlineFlyout  = $('#preferredAirlineFlyout').val(); }
    
    var planeXML = '\
    <PlaneRequest>  \
        <title>' + $('.titlePassenger').val() + '</title> \
        <planePassenger>' + planePassenger + '</planePassenger> \
        <typeFlyin>' + $('.flightTypeFlyin').val() + '</typeFlyin> \
        <preferredFlyin>' + preferredAirlineFlyin + '</preferredFlyin> \
        <flightNoFlyin>' + $('.flightNoFlyin').val() + '</flightNoFlyin> \
        <etdFlyin>' + $('.etdFlyin').val() + '</etdFlyin> \
        <dateFlyin>' + $('.dateFlyin').val() + '</dateFlyin> \
        <typeFlyout>' + $('.flightTypeFlyout').val() + '</typeFlyout> \
        <preferredFlyout>' + preferredAirlineFlyout + '</preferredFlyout> \
        <flightNoFlyout>' + $('.flightNoFlyout').val() + '</flightNoFlyout> \
        <etdFlyout>' + $('.etdFlyout').val() + '</etdFlyout> \
        <dateFlyout>' + $('.dateFlyout').val() + '</dateFlyout> \
    </PlaneRequest>';
    //Store to Array
    planeRequests[index] = planeXML;
    //showAlert(planeXML);
}
function processHotelEntry(){
    var index = hotelRequests.length;
    
    var hotelGuest;
    if ($('#hotelGuest').val() == "Other"){ hotelGuest = $('.otherguestName').val(); } else { hotelGuest = $('#hotelGuest').val(); }
    var hotelLocation;
    if ($('#hotelLocation').val() == "Other"){ hotelLocation = $('.otherlocation').val(); } else { hotelLocation = $('#hotelLocation').val(); }
    var roomType;
    if ($('#roomType').val() == "Other"){ roomType = $('.otherroomType').val(); } else { roomType = $('#roomType').val(); }
    var roomCategory;
    if ($('#roomCategory').val() == "Other"){ roomCategory = $('.otherroomCategory').val(); } else { roomCategory = $('#roomCategory').val(); }
    
    var hotelXML = '\
    <HotelRequest> \
        <guestName>' + hotelGuest + '</guestName> \
        <hotel>' + $('.preferredHotel').val() + '</hotel> \
        <location>' + hotelLocation + '</location> \
        <roomType>' + roomType + '</roomType> \
        <roomCategory>' + roomCategory + '</roomCategory> \
        <checkin>' + $('.checkInDate').val() + '</checkin> \
        <checkout>' + $('.checkOutDate').val() + '</checkout> \
        <roomNights>' + $('.roomNights').val() + '</roomNights> \
    </HotelRequest>';
    //Store to Array
    hotelRequests[index] = hotelXML;
    //showAlert(hotelXML);
}
function processCarEntry(){
    var index = carRequests.length;
    
    var carPassenger;
    if ($('#carPassenger').val() == "Other"){ carPassenger = $('.othercarPassenger').val(); } else { carPassenger = $('#carPassenger').val(); }
    var carDescription;
    if ($('#carDescription').val() == "Other"){ carDescription = $('.othercarDescription').val(); } else { carDescription = $('#carDescription').val(); }
    var carDuration;
    if ($('#carDuration').val() == "Other"){ carDuration = $('.othercarDuration').val(); } else { carDuration = $('#carDuration').val(); }
    var carDetails;
    if ($('#carDetails').val() == "Other"){ carDetails = $('.othercarDetails').val(); } else { carDetails = $('#carDetails').val(); }
    
    var carXML = '\
    <CarRequest> \
        <carPassenger>' + carPassenger + '</carPassenger> \
        <pickupTime>' + $('.pickUpTime').val() + '</pickupTime> \
        <pickupDate>' + $('.pickUpDate').val() + '</pickupDate> \
        <pickupPlace>' + $('.pickUpPlace').val() + '</pickupPlace> \
        <destination>' + $('.destination').val() + '</destination> \
        <paxNo>' + $('.paxNo').val() + '</paxNo> \
        <description>' + carDescription + '</description> \
        <duration>' + carDuration + '</duration> \
        <details>' + carDetails + '</details> \
    </CarRequest>';
    //Store to Array
    carRequests[index] = carXML;
    //showAlert(carXML);
}
function processRegEntry(){
    var index = regRequests.length;
    
    var hcpReg;
    if ($('#hcpReg').val() == "Other"){ hcpReg = $('.otherhcpReg').val(); } else { hcpReg = $('#hcpReg').val(); }

    var regXML = '\
    <RegRequest> \
        <hcpReg>' + $('#hcpReg').val() + '</hcpReg> \
        <prcNo>' + $('.prcNo').val() + '</prcNo> \
        <mailing>' + $('.mailingAddress').val() + '</mailing> \
        <emailAddress>' + $('.emailAddress').val() + '</emailAddress> \
        <membership>' + $('.membership').val() + '</membership> \
    </RegRequest>';
    //Store to Array
    regRequests[index] = regXML;
    //showAlert(regXML);
}
function processOtherEntry(){
    var index = otherRequests.length;
    
    var hcpOther;
    if ($('#hcpOther').val() == "Other"){ hcpOther = $('.otherhcpOther').val(); } else { hcpOther = $('#hcpOther').val(); }
    
    var otherXML = '\
    <OtherRequest> \
        <otherType>' + $('.otherType').val() + '</otherType> \
        <hcpOther>' + $('#hcpOther').val() + '</hcpOther> \
        <mobileOther>' + $('.otherMobile').val() + '</mobileOther> \
        <remarks>' + $('.remarks').val() + '</remarks> \
    </OtherRequest>';
    //Store to Array
    otherRequests[index] = otherXML;
    //showAlert(otherXML);
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
function pageController(currentPage){
    switch (currentPage){
        case 'menuPage' :
            console.log(currentPage);
            break;
        case 'requestPage':
            $("#"+currentPage).removeClass('hidden').addClass('shown');
            $('#databasePage').removeClass('shown').addClass('hidden');
            $('#aboutPage').removeClass('shown').addClass('hidden');
            $('.backer').removeClass('hidden').addClass('shown');
            $('.backer').click(function(){
                               $("#"+currentPage).removeClass('shown').addClass('hidden');
                               $('.backer').removeClass('shown').addClass('hidden');
                               $('#menuPage').removeClass('hidden').addClass('shown');
                               });
            reset();
            break;
        case 'databasePage':
            $("#"+currentPage).removeClass('hidden').addClass('shown');
            $('#requestPage').removeClass('shown').addClass('hidden');
            $('#aboutPage').removeClass('shown').addClass('hidden');
            $('.backer').removeClass('hidden').addClass('shown');
            $('.backer').click(function(){
                               $("#"+currentPage).removeClass('shown').addClass('hidden');
                               $('.backer').removeClass('shown').addClass('hidden');
                               $('#menuPage').removeClass('hidden').addClass('shown');
                               });
            break;
        case 'aboutPage':
            $("#"+currentPage).removeClass('hidden').addClass('shown');
            $('#requestPage').removeClass('shown').addClass('hidden');
            $('#databasePage').removeClass('shown').addClass('hidden');
            $('.backer').removeClass('hidden').addClass('shown');
            $('.backer').click(function(){
                               $("#"+currentPage).removeClass('shown').addClass('hidden');
                               $('.backer').removeClass('shown').addClass('hidden');
                               $('#menuPage').removeClass('hidden').addClass('shown');
                               });
            break;
    }
    //$('.backer').removeClass('hidden');
}
function fireJquery(){
    $(document).ready(function(){
                      //runSQL("Delete from AccountHandler");
                      reset();
                      
                      //Link Pagers
                      $('.pager').click(function(){
                                        var showPage = $(this).attr('id');
                                        pageController(showPage.substring(0, showPage.length-1));
                                        //showAlert(showPage);
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
                                            var item = planeRequests.length;
                                            $('.addedPlaneRequest').append('<tr>\
                                                                           <td>' + item + '</td> \
                                                                           <td>' + $('#preferredAirlineFlyin').val() + '</td> \
                                                                           <td>' + $('#planePassenger').val() + '</td> \
                                                                           </tr>');
                                            $('.addedPlaneRequest tr').addClass('selectable');
                                            processPlaneEntry();
                                            });
                      $('.hotelSave').click(function(){
                                            var item = hotelRequests.length;
                                            $('.addedHotelRequest').append('<tr>\
                                                                           <td>' + item + '</td> \
                                                                           <td>' + $('.preferredHotel').val() + '</td> \
                                                                           <td>' + $('#hotelGuest').val() + '</td> \
                                                                           </tr>');
                                            $('.addedHotelRequest tr').addClass('selectable');
                                            processHotelEntry();
                                            });
                      $('.carSave').click(function(){
                                          var item = carRequests.length;
                                          $('.addedCarRequest').append('<tr>\
                                                                       <td>' + item + '</td> \
                                                                       <td>' + $('.destination').val() + '</td> \
                                                                       <td>' + $('#carPassenger').val() + '</td> \
                                                                       </tr>');
                                          $('.addedCarRequest tr').addClass('selectable');
                                          processCarEntry();
                                          });
                      $('.regSave').click(function(){
                                          var item = regRequests.length;
                                          $('.addedRegRequest').append('<tr>\
                                                                       <td>' + item + '</td> \
                                                                       <td>' + $('.prcNo').val() + '</td> \
                                                                       <td>' + $('#hcpReg').val() + '</td> \
                                                                       </tr>');
                                          $('.addedRegRequest tr').addClass('selectable');
                                          processRegEntry();
                                          });
                      $('.otherSave').click(function(){
                                            var item = otherRequests.length;
                                            $('.addedOtherRequest').append('<tr>\
                                                                           <td>' + item + '</td> \
                                                                           <td>' + $('#hcpOther').val() + '</td> \
                                                                           <td>' + $('.otherType').val() + '</td> \
                                                                           <td>' + $('.remarks').val() + '</td> \
                                                                           </tr>');
                                            $('.addedOtherRequest tr').addClass('selectable');
                                            processOtherEntry();
                                            });
                      $('.selectable').click(function(){
                                             var closestTr = $(this).closest('tr');
                                             if ($(closestTr).hasClass('selected') == true){
                                             $(closestTr).removeClass('selected');
                                             } else {
                                             $(closestTr).addClass('selected');
                                             }
                                             });
                      $('.deleteRow').click(function(){
                                            var arrayName = $(this).attr('id').substring(6,this.length);
                                            eval(arrayName).pop();
                                            $('#'+arrayName+' tr:last').remove();
                                            });
                      //Generate XML
                      $('.newRequestSubmit').click(function(){
                                                   if ($(this).hasClass('disable')){
                                                   showAlert("Create New Request");
                                                   } else {
                                                   fsAccess("NewRequest");
                                                   $(this).addClass('disable');
                                                   }
                                                   //window.plugin.email.open();
                                                   });
                      //Download XML
                      $('.downloadXML').click(function(){
                                              fsAccess("UpdateDatabase");
                                              });
                      //OtherInputs
                      $('.activityDate').change(function(){
                                                var allowedDate = new Date($('.activityDate').val());
                                                allowedDate.setDate(allowedDate.getDate()+3);
                                                var timeDiff = Math.abs(allowedDate.getTime() - new Date().getTime());
                                                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                                if (diffDays < 6){
                                                $('#justification').show();
                                                } else {
                                                $('#justification').hide();
                                                $('.justification').val('');
                                                }
                                                });
                      
                      $('.membership').change(function(){
                                              var closest = $(this).attr('id');
                                              var toSee = closest.substring(0, closest.length-1);
                                              $('.membersSelector').hide();
                                              $('#'+toSee).show();
                                              });
                      
                      $('.selector').change(function(){
                                            var pass = $(this).attr('id');
                                            getDetails(pass+'Details', $(this).val());
                                            });
                      });

}