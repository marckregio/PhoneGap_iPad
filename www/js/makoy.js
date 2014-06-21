/*
 * Hard Coded and Tested by Marck Litonjua Regio
 */
function makoy(){
    createDB();
}
//File Accessors
function requestAccess(){
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, failAccess);
}
function failAccess(){
    alert("Failed to access FileSystem");
}

function gotFS(FileSystem){
    window.rootFS = FileSystem.root;
    alert(window.rootFS.fullPath);
}
//Database Accessors
function createDB(){
    var db = window.openDatabase("DB","1.0","NestleETravel",10485760);
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
function query(tx){

}
function errorException(tx, error){
    alert("DBError:" + error);
}
function success(){
    console.log("Tagumpay");
}