/*
 * Hard Coded and Tested by Marck Litonjua Regio
 */
function makoy(){
    //createDB();
    //loginChecker();
    //requestAccess();
}
//File Accessors
function requestAccess(){
    xmlString = makeXML();
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, failAccess);
}
function failAccess(){
    showAlert("Failed to access FileSystem");
}
function gotFS(FileSystem){
    window.rootFS = FileSystem.root;
    //alert(window.rootFS.fullPath);
    window.rootFS.getFile("request"+id+".xml", {create: true, exclusive: false},
                          function(fileEntry){
                          fileEntry.createWriter(fileWriter, errorException);
                          }, errorException);
}
function fileWriter(writer){
    //writer.onwriteend = function(evt){};
    writer.seek(writer.length);
    writer.write(xmlString);
    showAlert("XML FILE GENERATED");
}
function makeXML(){
    var template = '<?xml version="1.0" encoding="UTF-8"?> \
    <Section1> \
    <head> \
        <referenceNo>' + refNo + '</referenceNo> \
        <requestor>' + requestor + '</requestor> \
        <mobileno>' + mobileno + '</mobileno> \
        <activityName>' + activityName + '</activityName> \
        <accountNo>' + accountNo + '</accountNo> \
        <costcenter>' + costCenter + '</costcenter> \
        <dateofActivity>' + dateofActivity + '</dateofActivity> \
        <justification>' + justification + '</justification> \
    </head> \
    <body> \
        <Airline> \
            <planePassenger>' + planePassenger + '</planePassenger> \
            <airline>' + airline + '</airline> \
        </Airline> \
        <Hotel> \
            <guestName>' + guestName + '</guestName> \
            <roomlocation>' + roomlocation +'</roomlocation> \
            <roomType>' + roomType + '</roomType> \
            <category>' + category + '</category> \
        </Hotel> \
        <Car> \
            <carPassenger>' + carPassenger + '</carPassenger> \
            <description>' + description + '</description> \
            <duration>' + duration + '</duration> \
            <carDetails>' + carDetails + '</carDetails> \
        </Car> \
        <Registration> \
            <hcpName>' + hcpName + '</hcpName> \
            <membership>' + membership + '</membership> \
            <prcNo>' + prcNo + '</prcNo> \
            <mailing>' + mailing + '</mailing> \
            <email>' + email + '</email> \
        </Registration> \
        <Others> \
            <hcpName2>' + hcpName2 + '</hcpName2> \
            <hcpMobile>' + hcpMobile + '</hcpMobile> \
            <remarks>' + remarks + '</remarks> \
        </Others> \
    </body> \
    </Section1> \
    ';
    return template;
}
//Database Accessors
function createDB(){
    db = window.openDatabase("NestleDB","1.0","NestleETravel",10485760);
    db.transaction(createTables, errorException, success);
}
function createTables(tx){
    tx.executeSql('Create Table If Not Exists AccountHandler (id unique, fullname text, mobileno text, address text)');
    tx.executeSql('Create Table If Not Exists Request (id unique, referenceNo text, mobileno text, dateofBirth text, activityName text, accountno text, costcenter text)');
    tx.executeSql('Create Table If Not Exists PlaneRequest (id unique, parentid text, title text, passenger text, airline text)');
    tx.executeSql('Create Table If Not Exists HotelAccommodation (id unique, parentid text, guestName text, preferredHotel text, location text, roomType text, category text)');
    tx.executeSql('Create Table If Not Exists CarService (id unique, parentid text, passenger text, mobileno text, pickupPlace text, description text, destination text, paxNo text)');
    tx.executeSql('Create Table If Not Exists Registration (id unique, parentid text, hcpname text, mobileno text, prcno text, mailing text, email text)');
    tx.executeSql('Create Table If Not Exists OtherRequest (id unique, parentid text, hcpname text, mobileno text, remarks text)');
}
function RunDynamicSQL(queryString){
    db.transaction(function(tx){
                   tx.executeSql(queryString);
                   }, errorException, success);
}
function loginChecker(){
    db.transaction(function(tx){
                   tx.executeSql('Select * from AccountHandler',[],
                                 function(tx,results){
                                 //ResultSet
                                 var len = results.rows.length;
                                 if (len > 0){
                                 loginCheck = true;
                                 currentUser = results.rows.item(0)['fullname'];
                                 }else{
                                 alert("no data");
                                 loginCheck = false;
                                 }
                                 },errorException);
                   },errorException,success);
}
function RunDynamicSQLReturn(queryString){
    db.transaction(function(tx){
                   tx.executeSql(queryString,[],
                                 function(tx,results){
                                 //ResultSet
                                 var len = results.rows.length;
                                 if (len > 0){
                                 for (var i = 0; i < len; i++){
                                 alert(results.rows.item(i)['fullname']);
                                 }
                                 }else{
                                 alert("no data");
                                 }
                                 },errorException);
                   },errorException,success);
}
function errorException(error){
    showAlert("DBError: " + error.message);
}
function success(tx){
    console.log("Tagumpay");
}
function showAlert(alert){
    navigator.notification.alert(
        alert,
        function(){
            console.log("Alert triggered");
        },
        'Nestle E-Travel',
        'Ok'
    );
}