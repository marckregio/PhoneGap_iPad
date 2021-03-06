/*
 * Developed By: Marck Litonjua Regio
 */
var db;
var planeRequests = [];
var planeRequestsSummary = [];
var hotelRequests = [];
var hotelRequestsSummary = [];
var carRequests = [];
var carRequestsSummary = [];
var regRequests = [];
var regRequestsSummary = [];
var otherRequests = [];
var otherRequestsSummary = [];
var dateJSON = new Date().toJSON();
var currentDate = dateJSON.slice(0, 10);
var rand = "";
var ifPlanned = "Planned";
var planeHasLeadtime = 0;
function makoy(){
    //Initialization
    //fsAccess("TestEmail");
    createDB();
    fireJquery();
}
function reset(){
    rand = Math.floor((Math.random() * 100) + 1);
    $('.referenceNo').text(currentDate+"-"+rand);
    $('select').val("");
    $('.selector option').remove();
    $('.selector').append('<option value="">Select an item</option>');
    $('input[type="text"]').val("");
    $('input[type="date"]').val(currentDate);
    $('textarea').val("");
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
    
    if ($('.dbLink').val() == ""){
        runSQL("Insert into DropboxLink (dbLink) VALUES ('https://www.dropbox.com/s/7i8rwhy0jsh65wu/nestleDB.xml?dl=1')");
    }
    loadDropdowns();
    
}
function deleteDB(){
    runSQL("Delete from MainTableAccountNo");
    runSQL("Delete from MainTableActivityType");
    runSQL("Delete from MainTableActivityNameDetails");
    runSQL("Delete from MainTableCostCenter");
    runSQL("Delete from PlaneTableAirline");
    runSQL("Delete from HotelTableLocation");
    runSQL("Delete from HotelTableRoomType");
    runSQL("Delete from HotelTableRoomCategory");
    runSQL("Delete from CarTableDescription");
    runSQL("Delete from CarTableDuration");
    runSQL("Delete from CarTableDetails");
    runSQL("Delete from Passengers");
    runSQL("Delete from RegPrcNo");
}
function loadDropdowns(){
    authUser("AccountHandler","*","");
    getDBLink("DropboxLink","*","");
    dropDownData("Passengers", "*", "Where delegate = '" + $('.requestorName').text() + "'");
    dropDownData("MainTableAccountNo","*","");
    dropDownData("MainTableActivityType","*","");
    dropDownData("MainTableActivityNameDetails","*","");
    dropDownData("MainTableCostCenter","*","");
    dropDownData("PlaneTableAirline", "*", "");
    dropDownData("HotelTableLocation","*","");
    dropDownData("HotelTableRoomType","*","");
    dropDownData("HotelTableRoomCategory","*","");
    dropDownData("CarTableDescription","*","");
    dropDownData("CarTableDetails","*","");
    dropDownData("CarTableDuration","*","");
    dropDownData("RegPrcNo","*","");
    dropDownData("Agreement","*","");
    
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
    } else if (method == "TestEmail"){
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                                 window.rootFS = fileSystem.root;
                                 fs = window.rootFS;
                                 //generateFile();
                                 //composeEmail(window.rootFS.fullPath + "");
                                 }, gotError);
    } else if (method == "fromDropbox"){
        runSQL("Delete from DropboxLink");
        runSQL("Insert into DropboxLink (dbLink) VALUES ('" + $('.dbLink').val() + "')");
        
        readFromDropbox();
    }
}
function generateFile(){
    window.rootFS.getFile($(".referenceNo").text() + ".xml", {create:true, exclusive:false},
                          function(fileEntry){
                          fileEntry.createWriter(function(writer){
                                                 writer.seek(writer.length);
                                                 writer.write(xmlBuilder());
                                                 console.log("File Generated");
                                                 composeEmail(window.rootFS.fullPath + "/" +$(".referenceNo").text() + ".xml");
                                                 }, gotError);
                          }, gotError);
}
function readFile(){
    ActivityIndicator.show("Updating Database");
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
                                                         runSQL("Insert into MainTableActivityType (activityName, agency) Values ('" + $(this).find("name").text() + "','" + $(this).find("agency").text() + "')");
                                                         });
          xml.find("ActivityNamesDetails").find("activitydetails").each(function(){
                                                    //showAlert($(this).text());
                                                    runSQL("Insert into MainTableActivityNameDetails (activityDetail) Values ('" + $(this).text() + "')");
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
          ActivityIndicator.hide();
          }).fail(function(){
                  showAlert("Can't Update Database \n No Database File Found \n Please Try Again");
                  ActivityIndicator.hide();
                  });
}
function readFromDropbox(){
    ActivityIndicator.show("Updating Database");
    $.get($('.dbLink').val(),
          function(rawXML){
          var xml = $(rawXML);
          deleteDB();
          xml.find("PassengerDetails").find("passenger").each(function(){
                                                              //showAlert($(this).text());
                                                              runSQL("Insert into Passengers (name, hcp, mobile, birthdate, delegate) Values ('" + $(this).find("name").text() + "','" + $(this).find("hcpid").text()+ "','" + $(this).find("mobileno").text()+ "','" + $(this).find("birthdate").text()+ "','" + $(this).find("delegate").text() + "')");
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
                                                          runSQL("Insert into MainTableActivityType (activityName, agency) Values ('" + $(this).find("name").text() + "','" + $(this).find("agency").text() + "')");
                                                          });
          xml.find("ActivityNamesDetails").find("details").each(function(){
                                                                        //showAlert($(this).text());
                                                                        runSQL("Insert into MainTableActivityNameDetails (activityName, activityDetail, graceperiod, activitydeadline) Values ('" + $(this).find("activitytype").text() + "','" + $(this).find("activitydetails").text() + "','"+ $(this).find("graceperiod").text() +"','" + $(this).find("activitydeadline").text() + "')");
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
          xml.find("PrcNo").find("prc").each(function(){
                                                        //showAlert($(this).text());
                                                        runSQL("Insert into RegPrcNo (prc) Values ('" + $(this).text() + "')");
                                                        });
          console.log("XML Fetched!");
          ActivityIndicator.hide();
          }).fail(function(){
                  showAlert("Can't Update Database \n No Database File Found \n Please Try Again");
                  ActivityIndicator.hide();
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
    
    //SUBMISSION DATE
    var SQLDate = currentDate + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + ":" + new Date().getMilliseconds();
    
    //var activityNameDetails = "";
    //if ($('#activityNameDetails').val() == "Unplanned"){ activityNameDetails = $('.otherActivityName').val(); ifPlanned = "Unplanned";
    //} else { activityNameDetails = $('#activityNameDetails').val(); ifPlanned = "Planned"; }
    
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
            <activityType>' + $('#activityName').val() + '</activityType> \
            <activityName>' + $('#activityNameDetails').val() + '</activityName> \
            <accountNo>' + accountNo + '</accountNo> \
            <costCenter>' + costCenter + '</costCenter> \
            <submissiondate>' + SQLDate + '</submissiondate> \
            <plan>' + $('.plan').val() + '</plan> \
            <planeLeadtime>' + planeHasLeadtime + '</planeLeadtime> \
            <ipad>yes</ipad> \
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
    tx.executeSql('Create Table If Not Exists Agreement (id integer primary key autoincrement, agree VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists AccountHandler (id integer primary key autoincrement, lastname VARCHAR(255), firstname VARCHAR(255), middlename VARCHAR(255), birthdate VARCHAR(255), mobileno VARCHAR(255), address VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists MainTableActivityType (id integer primary key autoincrement, activityName VARCHAR(255), agency VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists MainTableActivityNameDetails (id integer primary key autoincrement, activityDetail VARCHAR(255), activityName VARCHAR(255), graceperiod VARCHAR(255), activitydeadline VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists MainTableAccountNo(id integer primary key autoincrement, accountNumber VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists MainTableCostCenter (id integer primary key autoincrement, costCenter VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists PlaneTableAirline (id integer primary key autoincrement, airline VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists HotelTableLocation (id integer primary key autoincrement, location VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists HotelTableRoomType (id integer primary key autoincrement, roomType VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists HotelTableRoomCategory (id integer primary key autoincrement, roomCategory VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists CarTableDescription (id integer primary key autoincrement, description VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists CarTableDuration (id integer primary key autoincrement, duration VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists CarTableDetails (id integer primary key autoincrement, details VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists RegPrcNo (id integer primary key autoincrement, prc VARCHAR(255))');
    tx.executeSql('Create Table If Not Exists Passengers (id integer primary key autoincrement, name VARCHAR(255), mobile VARCHAR(255), hcp VARCHAR(255), birthdate VARCHAR(255), delegate VARCHAR(255) )');
    tx.executeSql('Create Table If Not Exists DropboxLink (id integer primary key autoincrement, dbLink VARCHAR(255))');
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
function getDBLink(dbName, fields, whereClause){
    queryString = "Select " + fields + " from " + dbName + " " + whereClause;
    db.transaction(function(tx){
                   tx.executeSql(queryString,[], getDBLinkData, gotError);
                   }, function(){ console.log($('.dbLink').val() + "");
                   }, function(){ console.log("runSQLReturn Successful"); });
}
function dropDownData(dbName,fields,whereClause){
    var queryString = "Select " + fields + " from " + dbName +" "+ whereClause;
    db.transaction(function(tx){
                   tx.executeSql(queryString,[], eval('get'+dbName+'List'), gotError);
                   }, function(){ console.log("Cannot Load Dropdown");
                   }, function(){ console.log("runSQLReturn Successful"); });
}
function getDetails(forList, name){
    var queryString = "Select * from Passengers Where name = '" + name + "' and delegate = '" + $('.requestorName').text() + "'";
    db.transaction(function(tx){
                   tx.executeSql(queryString,[], eval(forList), gotError);
                   }, function(){ console.log("Cannot Load For List");
                   }, function(){ console.log("runSQLReturn Successful"); });
}
function getAgreementList(tx, results){
    var isAgreed = results.rows.length;
    if (isAgreed == 0){
        myApp.popup('.agreement');
    }
}
function getAccountList(tx, results){
    var fullname = results.rows.item(0)['firstname'] + " " + results.rows.item(0)['middlename'] + " " + results.rows.item(0)['lastname'];
    //showAlert("Welcome to E-Travel " + fullname);
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
function getRegPrcNoList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['prc'];
        $('#prcNo').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getMainTableAccountNoList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['accountNumber'];
        $('#accountNo').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getMainTableActivityTypeList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['activityName'];
        $('#activityName').append('<option value="' + dt + '">' + dt + '</option>');
    }
}
function getMainTableActivityNameDetailsList(tx, results){
    var len = results.rows.length;
    for (var i = 0; i < len; i++){
        var dt = results.rows.item(i)['activityDetail'];
        var activitydeadline = new Date(Date.parse(results.rows.item(i)['activitydeadline']));
        var graceperiod = new Date(Date.parse(results.rows.item(i)['graceperiod']));
        if (new Date() < activitydeadline){
            $('#activityNameDetails').append('<option value="' + dt + '">' + dt + '</option>');
        }
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
    $('.planehcpId').val(''+results.rows.item(0)['hcp']);
    $('.planeBirthdate').val(''+results.rows.item(0)['birthdate']);
    $('.planeMobileNo').val(''+results.rows.item(0)['mobile']);
}
function hotelGuestDetails(tx, results){
    $('.hotelhcpId').val(''+results.rows.item(0)['hcp']);
    $('.hotelBirthdate').val(''+results.rows.item(0)['birthdate']);
    $('.hotelMobileNo').val(''+results.rows.item(0)['mobile']);
}
function carPassengerDetails(tx, results){
    $('.carhcpId').val(''+results.rows.item(0)['hcp']);
    $('.carBirthdate').val(''+results.rows.item(0)['birthdate']);
    $('.carMobileNo').val(''+results.rows.item(0)['mobile']);
}
function hcpRegDetails(tx, results){
    $('.reghcpId').val(''+results.rows.item(0)['hcp']);
    $('.regBirthdate').val(''+results.rows.item(0)['birthdate']);
    $('.regMobileNo').val(''+results.rows.item(0)['mobile']);
}
function hcpOtherDetails(tx, results){
    $('.otherhcpId').val(''+results.rows.item(0)['hcp']);
    $('.otherBirthdate').val(''+results.rows.item(0)['birthdate']);
    $('.otherMobileNo').val(''+results.rows.item(0)['mobile']);
}
//Array Handlers
function processPlaneEntry(){
    var index = planeRequests.length;
    var indexSummary = planeRequestsSummary.length;
    
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
        <planeJustification>' + $('.justification').val() + '</planeJustification> \
    </PlaneRequest>';
    
    var planeSummary = ' \
        <div class="content-inner"> \
            <div class="content-block-title">Passenger Information</div> \
            <div class="list-block"> \
                <ul> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Title</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.titlePassenger').val() + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Passenger</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + planePassenger  + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">HCPID</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.planehcpId').val() + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Birthdate</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.planeBirthdate').val() +'"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Mobile Number</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.planeMobileNo').val() +'"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                </ul> \
            </div> \
        </div> \
        <div class="content-inner"> \
            <div class="content-block-title">Fly-in Details</div> \
            <div class="list-block"> \
                <ul> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Airline Type</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.flightTypeFlyin').val() + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                            <div class="item-title label">Preferred Airline</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + preferredAirlineFlyin + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Flight No.</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.flightNoFlyin').val() + '"/> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">ETD</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.etdFlyin').val() + '"/> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Flight Date</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.dateFlyin').val() + '"/> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                </ul> \
            </div> \
        </div> \
        <div class="content-inner"> \
            <div class="content-block-title">Fly-out Details</div> \
            <div class="list-block"> \
                <ul> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Airline Type</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.flightTypeFlyout').val() + '"/> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Preferred Airline</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + preferredAirlineFlyout + '"/> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Flight No.</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.flightNoFlyout').val() + '"/> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">ETD</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.etdFlyout').val() + '"/> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Flight Date</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.dateFlyout').val() + '"/> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                </ul> \
            </div> \
        </div> \
        <div class="content-block-title"> \
            <a href="#" class="button close-popup planeDelete">Delete Entry</a><br> \
            <a href="#" class="button close-popup">Close</a> \
        </div> \
    ';
    //Store to Array
    planeRequests[index] = planeXML;
    planeRequestsSummary[indexSummary] = planeSummary;
    //showAlert(planeXML);
}
function processHotelEntry(){
    var index = hotelRequests.length;
    var indexSummary = hotelRequestsSummary.length;
    
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
    
    var hotelSummary = '\
    <div class="content-inner"> \
        <div class="list-block"> \
            <ul> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Guest Name</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + hotelGuest + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">HCPID</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.hotelhcpId').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Birthdate</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.hotelBirthdate').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Mobile Number</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.hotelMobileNo').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
            </ul> \
        </div> \
    </div> \
    <div class="content-inner"> \
        <div class="content-block-title">Hotel Details</div> \
        <div class="list-block"> \
            <ul> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Preferred Hotel</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.preferredHotel').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Location</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + hotelLocation  + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Room Type</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + roomType  + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Room Category</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + roomCategory  + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Check-in Date</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.checkInDate').val()  + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Check-out Date</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.checkOutDate').val()  + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Room Nights</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.roomNights').val()  + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
            </ul> \
        </div> \
    </div> \
    <div class="content-block-title"> \
        <a href="#" class="button close-popup hotelDelete">Delete Entry</a><br> \
        <a href="#" class="button close-popup">Close</a> \
    </div> \
    ';
    //Store to Array
    hotelRequests[index] = hotelXML;
    hotelRequestsSummary[indexSummary] = hotelSummary;
    //showAlert(hotelSummary);
}
function processCarEntry(){
    var index = carRequests.length;
    var indexSummary = carRequestsSummary.length;
    
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
    
    var carSummary = '\
        <div class="content-inner"> \
            <div class="content-block-title">Passenger Information</div> \
            <div class="list-block"> \
                <ul> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Name</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + carPassenger + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">HCPID</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.carhcpId').val() + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Birthdate</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.carBirthdate').val() + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Mobile Number</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.carMobileNo').val() + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Pick-up Time</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.pickUpTime').val()  + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Pick-up Date</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.pickUpDate').val()  + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Pick-up Place</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.pickUpPlace').val()  + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Destination</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.destination').val()  + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">No. of Passenger</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + $('.paxNo').val() + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                </ul> \
            </div> \
        </div> \
        <div class="content-inner"> \
            <div class="content-block-title">Car Details</div> \
            <div class="list-block"> \
                <ul> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Description</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + carDescription  + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Duration</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + carDuration  + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                    <li> \
                        <div class="item-content"> \
                            <div class="item-inner"> \
                                <div class="item-title label">Car Details</div> \
                                <div class="item-input"> \
                                    <input disabled type="text" value="' + carDetails  + '"> \
                                </div> \
                            </div> \
                        </div> \
                    </li> \
                </ul> \
            </div> \
        </div> \
    <div class="content-block-title"> \
        <a href="#" class="button close-popup carDelete">Delete Entry</a><br> \
        <a href="#" class="button close-popup">Close</a> \
    </div> \
    ';
    
    //Store to Array
    carRequests[index] = carXML;
    carRequestsSummary[indexSummary] = carSummary;
    //showAlert(carSummary);
}
function processRegEntry(){
    var index = regRequests.length;
    var indexSummary = regRequestsSummary.length;
    
    var hcpReg;
    if ($('#hcpReg').val() == "Other"){ hcpReg = $('.otherhcpReg').val(); } else { hcpReg = $('#hcpReg').val(); }
    var membership;
    var membershipCategory;
    if ($('#members').is(':checked')){ membershipCategory = $('#hcpMember').val();  membership = $('#members').val();}
    else if ($('#nonmembers').is(':checked')) { membershipCategory = $('#hcpNonmember').val(); membership = $('#nonmembers').val(); }

    var regXML = '\
    <RegRequest> \
        <hcpReg>' + $('#hcpReg').val() + '</hcpReg> \
        <prcNo>' + $('#prcNo').val() + '</prcNo> \
        <regActivityDate>' + $('.regactivityDate').val() + '</regActivityDate> \
        <mailing>' + $('.mailingAddress').val() + '</mailing> \
        <emailAddress>' + $('.emailAddress').val() + '</emailAddress> \
        <membership>' + membership + '</membership> \
        <category>' + membershipCategory + '</category> \
    </RegRequest>';
    
    var regSummary = '\
    <div class="content-inner"> \
        <div class="list-block"> \
            <ul> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">HCP Name</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('#hcpReg').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">HCPID</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.reghcpId').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Birthdate</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.regBirthdate').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Mobile Number</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.regMobileNo').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">PRC No.</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('#prcNo').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Mailing Address</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.mailingAddress').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Email Address</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.emailAddress').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Membership</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + membership + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Category</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + membershipCategory + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
            </ul> \
        </div> \
    </div> \
    <div class="content-block-title"> \
        <a href="#" class="button close-popup regDelete">Delete Entry</a><br> \
        <a href="#" class="button close-popup">Close</a> \
    </div> \
    ';
    //Store to Array
    regRequests[index] = regXML;
    regRequestsSummary[indexSummary] = regSummary;
    //showAlert(regXML);
}
function processOtherEntry(){
    var index = otherRequests.length;
    var indexSummary = otherRequestsSummary.length;
    
    var hcpOther;
    if ($('#hcpOther').val() == "Other"){ hcpOther = $('.otherhcpOther').val(); } else { hcpOther = $('#hcpOther').val(); }
    
    var otherXML = '\
    <OtherRequest> \
        <otherType>' + $('.otherType').val() + '</otherType> \
        <hcpOther>' + $('#hcpOther').val() + '</hcpOther> \
        <otherActivityDate>' + $('.otheractivityDate').val() + '</otherActivityDate> \
        <remarks>' + $('.remarks').val() + '</remarks> \
    </OtherRequest>';
    
    var otherSummary = '\
    <div class="content-inner"> \
        <div class="list-block"> \
            <ul> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Type</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.otherType').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">HCP Name</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('#hcpOther').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">HCPID</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.otherhcpId').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Birthdate</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.otherBirthdate').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Mobile No.</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.otherMobileNo').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
                <li> \
                    <div class="item-content"> \
                        <div class="item-inner"> \
                            <div class="item-title label">Remarks</div> \
                            <div class="item-input"> \
                                <input disabled type="text" value="' + $('.remarks').val() + '"> \
                            </div> \
                        </div> \
                    </div> \
                </li> \
            </ul> \
        </div> \
    </div> \
    <div class="content-block-title"> \
        <a href="#" class="button close-popup otherDelete">Delete Entry</a><br> \
        <a href="#" class="button close-popup">Close</a> \
    </div> \
    ';
    
    //Store to Array
    otherRequests[index] = otherXML;
    otherRequestsSummary[indexSummary] = otherSummary;
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
//Email Handler
function composeEmail(pathOfXML){
    
    window.plugins.emailComposer.showEmailComposerWithCallback(function(result){
                                                               console.log(result);
                                                               },
                                                               "Nestle Nutrition Travel Request Reference No: " + $('.referenceNo').text(),
                                                               "DISCLAIMER: This email and any files transmitted with it are confidential and intended solely for the use of E-Travel Application owned by Nestle Philippines. Please notify the sender immediately by e-mail if you have received this e-mail by mistake and delete this e-mail from your system. If you are not the intended recipient you are notified that disclosing, copying, distributing or taking any action in reliance on the contents of this information is strictly prohibited.",
                                                               ["ihnetravel.makati@ph.nestle.com"],
                                                               [],
                                                               [],
                                                               false,
                                                               [pathOfXML]);
    
}
//Jquery Handlers
function pageController(currentPage){
    switch (currentPage){
        case 'menuPage' :
            $('#registrationPage').removeClass('shown').addClass('hidden');
            $('#menuPage').removeClass('hidden').addClass('shown');
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
                                                if ($('.lastname').val() != '' &&
                                                    $('.firstname').val() != '' &&
                                                    $('.middlename').val() != '' &&
                                                    $('.birthdate').val() != '' &&
                                                    $('.mobile').val() != '' &&
                                                    $('.address').val() != ''
                                                ){
                                                runSQL("Insert Into AccountHandler (lastname, firstname, middlename, birthdate, mobileno, address) Values \
                                                       ('"+$('.lastname').val()+"','"+$('.firstname').val()+"','"+$('.middlename').val()+"', \
                                                       '"+$('.birthdate').val()+"','"+$('.mobile').val()+"','"+$('.address').val()+"')");
                                                //runSQLReturn("AccountHandler","*","");
                                                reset();
                                                pageController('menuPage');
                                                } else {
                                                showAlert("Please Complete The Form");
                                                }
                                                });
                      //Tables Saving
                      $('.planeSave').click(function(){
                                            //Check if Complete
                                            if ($('.titlePassenger').val() != '' &&
                                                $('#planePassenger').val() != '' &&
                                                $('.flightTypeFlyin').val() != '' &&
                                                $('#preferredAirlineFlyin').val() != '' &&
                                                $('.flightNoFlyin').val() != '' &&
                                                $('.etdFlyin').val() != '' &&
                                                $('.dateFlyin').val() != '' &&
                                                $('.flightTypeFlyout').val() != '' &&
                                                $('#preferredAirlineFlyout').val() != '' &&
                                                $('.flightNoFlyout').val() != '' &&
                                                $('.etdFlyout').val() != '' &&
                                                $('.dateFlyout').val() != ''
                                            ){
                                            if (planeHasLeadtime == 1 && $('.justification').val() == ""){
                                                $('.planeError').html("Please provide your justification");
                                                $('.planeError').show();
                                                setTimeout(function(){$('.planeError').fadeOut('slow');}, 3000);
                                            } else {
                                            myApp.closeModal();
                                            var item = planeRequests.length;
                                            $('.addedPlaneRequest').append('<tr id="' + item + '" data-popup=".entrySummary" class="open-popup">\
                                                                           <td>' + $('#preferredAirlineFlyin').val() + '</td> \
                                                                           <td>' + $('.dateFlyin').val() + '</td> \
                                                                           <td>' + $('#planePassenger').val() + '</td> \
                                                                           </tr>');
                                            $('.addedPlaneRequest tr').click(function(){
                                                                             var selected = $(this).index();
                                                                             var body = planeRequestsSummary[selected]+'';
                                                                             $('#summary').html(body);
                                                                             $('.planeDelete').click(function(){
                                                                                                     //showAlert(selected + '');
                                                                                                     planeRequests.splice(selected,1);
                                                                                                     planeRequestsSummary.splice(selected,1);
                                                                                                     $('.addedPlaneRequest tr:eq(' + selected + ')').remove();
                                                                                                     });
                                                                             end();
                                                                             });
                                            
                                                processPlaneEntry();
                                            
                                            }
                                            } else {
                                            $('.planeError').html("Please complete the Form");
                                            $('.planeError').show();
                                            setTimeout(function(){$('.planeError').fadeOut('slow');}, 3000);
                                            }
                                            });
                      $('.hotelSave').click(function(){
                                            //Check if Complete
                                            if($('#hotelGuest').val() != '' &&
                                               $('.preferredHotel').val() != '' &&
                                               $('#hotelLocation').val() != '' &&
                                               $('#roomType').val() != '' &&
                                               $('#roomCategory').val() != '' &&
                                               $('.checkInDate').val() != '' &&
                                               $('.checkOutDate').val() != ''
                                            ){
                                            myApp.closeModal();
                                            var item = hotelRequests.length;
                                            $('.addedHotelRequest').append('<tr id="' + item + '" data-popup=".entrySummary" class="open-popup">\
                                                                           <td>' + $('.preferredHotel').val() + '</td> \
                                                                           <td>' + $('#hotelLocation').val() + '</td> \
                                                                           <td>' + $('#hotelGuest').val() + '</td> \
                                                                           </tr>');
                                            $('.addedHotelRequest tr').click(function(){
                                                                             var selected = $(this).attr('id');
                                                                             var body = hotelRequestsSummary[selected]+'';
                                                                             $('#summary').html(body);
                                                                             $('.hotelDelete').click(function(){
                                                                                                     hotelRequests.splice(selected,1);
                                                                                                     hotelRequestsSummary.splice(selected,1);
                                                                                                     $('.addedHotelRequest tr:eq(' + selected + ')').remove();
                                                                                                     
                                                                                                     });
                                                                             end();
                                                                             });
                                            processHotelEntry();
                                            } else {
                                            $('.planeError').html("Please complete the Form");
                                            $('.hotelError').show();
                                            setTimeout(function(){$('.hotelError').fadeOut('slow');}, 3000);
                                            }
                                            });
                      $('.carSave').click(function(){
                                          //Check if Complete
                                          if($('#carPassenger').val != '' &&
                                             $('.pickUpTime').val != '' &&
                                             $('.pickUpDate').val != '' &&
                                             $('.pickUpPlace').val != '' &&
                                             $('.destination').val != '' &&
                                             $('.paxNo').val != '' &&
                                             $('#carDescription').val != '' &&
                                             $('#carDuration').val != '' &&
                                             $('#carDetails').val != ''
                                          ){
                                          myApp.closeModal();
                                          var item = carRequests.length;
                                          $('.addedCarRequest').append('<tr id="' + item + '" data-popup=".entrySummary" class="open-popup">\
                                                                       <td>' + $('.destination').val() + '</td> \
                                                                       <td>' + $('.pickUpDate').val() + '</td> \
                                                                       <td>' + $('#carPassenger').val() + '</td> \
                                                                       </tr>');
                                          $('.addedCarRequest tr').click(function(){
                                                                         var selected = $(this).attr('id');
                                                                         var body = carRequestsSummary[selected]+'';
                                                                         $('#summary').html(body);
                                                                         $('.carDelete').click(function(){
                                                                                               carRequests.splice(selected,1);
                                                                                               carRequestsSummary.splice(selected,1);
                                                                                               $('.addedCarRequest tr:eq(' + selected + ')').remove();
                                                                                               
                                                                                               });
                                                                         end();
                                                                         });
                                          processCarEntry();
                                          } else {
                                          $('.planeError').html("Please complete the Form");
                                          $('.carError').show();
                                          setTimeout(function(){$('.carError').fadeOut('slow');}, 3000);
                                          }
                                          });
                      $('.regSave').click(function(){
                                          //Check if Complete
                                          if($('#hcpReg').val() != '' &&
                                             $('#prcNo').val() != '' &&
                                             $('.mailingAddress').val() != '' &&
                                             $('.emailAddress').val() != '' &&
                                             $('.membership').val() != ''
                                          ){
                                          myApp.closeModal();
                                          var item = regRequests.length;
                                          $('.addedRegRequest').append('<tr id="' + item + '" data-popup=".entrySummary" class="open-popup">\
                                                                       <td>' + $('.membership').val() + '</td> \
                                                                       <td>' + $('#prcNo').val() + '</td> \
                                                                       <td>' + $('#hcpReg').val() + '</td> \
                                                                       </tr>');
                                          $('.addedRegRequest tr').click(function(){
                                                                         var selected = $(this).attr('id');
                                                                         var body = regRequestsSummary[selected]+'';
                                                                         $('#summary').html(body);
                                                                         $('.regDelete').click(function(){
                                                                                               regRequests.splice(selected,1);
                                                                                               regRequestsSummary.splice(selected,1);
                                                                                               $('.addedRegRequest tr:eq(' + selected + ')').remove();
                                                                                               });
                                                                         end();
                                                                         });
                                          processRegEntry();
                                          } else {
                                          $('.planeError').html("Please complete the Form");
                                          $('.regError').show();
                                          setTimeout(function(){$('.regError').fadeOut('slow');}, 3000);
                                          }
                                          });
                      $('.otherSave').click(function(){
                                            //Check if Complete
                                            if($('.otherType').val() != '' &&
                                               $('#hcpOther').val() != ''
                                            ){
                                            myApp.closeModal();
                                            var item = otherRequests.length;
                                            $('.addedOtherRequest').append('<tr id="' + item + '" data-popup=".entrySummary" class="open-popup">\
                                                                           <td>' + $('#hcpOther').val() + '</td> \
                                                                           <td>' + $('.otherType').val() + '</td> \
                                                                           <td>' + $('.remarks').val() + '</td> \
                                                                           </tr>');
                                            $('.addedOtherRequest tr').click(function(){
                                                                             var selected = $(this).attr('id');
                                                                             var body = otherRequestsSummary[selected]+'';
                                                                             $('#summary').html(body);
                                                                             $('.otherDelete').click(function(){
                                                                                                     otherRequests.splice(selected,1);
                                                                                                     otherRequestsSummary.splice(selected,1);
                                                                                                     $('.addedOtherRequest tr:eq(' + selected + ')').remove();
                                                                                                     });
                                                                             end();
                                                                             });
                                            processOtherEntry();
                                            } else {
                                            $('.planeError').html("Please complete the Form");
                                            $('.otherError').show();
                                            setTimeout(function(){$('.otherError').fadeOut('slow');}, 3000);
                                            }
                                            });
                      
                      //Tables Delete
                      $('.deleteRow').click(function(){
                                            var arrayName = $(this).attr('id').substring(6,this.length);
                                            var arrayNameSummary = $(this).attr('id').substring(6,this.length) + "Summary";
                                            eval(arrayName).pop();
                                            eval(arrayNameSummary).pop();
                                            $('#'+arrayName+' tr:last').remove();
                                            });
                      
                      
                      //Generate XML
                      $('.newRequestSubmit').click(function(){
                                                   if($('#activityName').val() != '' &&
                                                      $('#activityNameDetails').val() != '' &&
                                                      $('#accountNo').val() != '' &&
                                                      $('#costCenter').val() != ''
                                                   ){
                                                   if ($(this).hasClass('disable')){
                                                   showAlert("Create New Request");
                                                   } else {
                                                   fsAccess("NewRequest");
                                                   $(this).addClass('disable');
                                                   }
                                                   } else {
                                                   showAlert("Please complete the form");
                                                   }
                                                   });
                      //Download XML
                      $('.downloadXML').click(function(){
                                              fsAccess("UpdateDatabase");
                                              });
                      $('.downloadXMLDropbox').click(function(){
                                                     fsAccess("fromDropbox");
                                              });
                      //OtherInputs
                      $('.dateFlyin').change(function(){
                                             var allowedDate = new Date($('.dateFlyin').val());
                                             allowedDate.setDate(allowedDate.getDate());
                                             var timeDiff = Math.abs(allowedDate.getTime() - new Date().getTime());
                                             var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                             if ($('.flightTypeFlyin').val() == "Domestic"){
                                                if (diffDays < 14){
                                                $('#planeJustification').show();
                                                planeHasLeadtime = 1;
                                                } else {
                                                $('#planeJustification').hide();
                                                $('.justification').val('');
                                                planeHasLeadtime = 0;
                                                }
                                             }
                                             if ($('.flightTypeFlyin').val() == "International"){
                                                if (diffDays < 28){
                                                $('#planeJustification').show();
                                                planeHasLeadtime = 1;
                                                } else {
                                                $('#planeJustification').hide();
                                                $('.justification').val('');
                                                planeHasLeadtime = 0;
                                                }
                                             }
                                             });
                      
                      $('.membership').change(function(){
                                              var closest = $(this).attr('id');
                                              var toSee = closest.substring(0, closest.length-1);
                                              $('.membersSelector').hide();
                                              $('#'+toSee).show();
                                              $('.mem').val("");
                                              });
                      
                      $('.selector').change(function(){
                                            if($(this).hasClass('passenger')){
                                            var pass = $(this).attr('id');
                                            getDetails(pass+'Details', $(this).val());
                                            }
                                            
                                            if ($(this).hasClass('cascadeActivityName')) {
                                            $('#activityNameDetails').find('option').remove();
                                            $('#activityNameDetails').append('<option value="">Select an item</option>');
                                            $('#activityNameDetails').val("");
                                            dropDownData("MainTableActivityNameDetails","*","Where activityName='" + $('#activityName').val().trim() + "'");
                                            }
                                            });
                      //Date Difference
                      $('.checkOutDate').change(function(){
                                                var checkIn = new Date($('.checkInDate').val());
                                                var checkOut = new Date($('.checkOutDate').val());
                                                if (checkIn < checkOut){
                                                var days = Math.abs(checkOut.getTime() - checkIn.getTime());
                                                $('.roomNights').val(Math.ceil(days / (1000 * 3600 * 24)) + '');
                                                } else {
                                                $('.roomNights').val(0 + '');
                                                }
                                                });
                      //Agreement
                      $('.agreeConfirm').click(function(){
                                               if ($('.dontShow').is(':checked')){
                                               runSQL("Insert into Agreement (agree) Values ('true')");
                                               }
                                               });
                      });

}