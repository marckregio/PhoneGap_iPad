var id = Math.floor((Math.random() * 100) + 1);
var db;
var loginCheck;
var currentUser;
var refNo,dateofActivity,justification,planePassenger,carPassenger,requestor,mobileno,dateofBirth,activityName,accountNo,costCenter,title,airline,guestName,roomlocation,roomType,category,description,duration,carDetails,hcpName,membership,prcNo,mailing,email,hcpName2,hcpMobile,remarks;
var xmlString ;
var currentDate;
var allowRequest;
//Temporary Database
//Head
var Passenger = [
                 {"passengerName":"Select a value","val":"","mobile":"","dateofbirth":""},
                 {"passengerName":"Georgina Macalindan","val":"Georgina Macalindan","mobile":"124949124","dateofbirth":"06/21/2014"},
                 {"passengerName":"Marck Regio","val":"Marck Regio","mobile":"09276572480","dateofbirth":"03/10/1994"},
                 {"passengerName":"Juan Dela Cruz","val":"Juan Dela Cruz","mobile":"0945412333","dateofbirth":"06/01/2014"}
];
var Accounts = [
                {"accountNo":"Select a value","val":""},
                {"accountNo":"6028000","val":"6028000"},
                {"accountNo":"4002160","val":"4002160"},
                {"accountNo":"6028020","val":"6028020"},
                {"accountNo":"5051020","val":"5051020"},
                {"accountNo":"6020030","val":"6020030"},
                {"accountNo":"5062050","val":"5062050"},
                {"accountNo":"6024030","val":"6024030"}
];
var CostCenters = [
                   {"costCenter":"Select a value","val":""},
                   {"costCenter":"24590455","val":"24590455"},
                   {"costCenter":"24590456","val":"24590456"},
                   {"costCenter":"25490450","val":"25490450"},
                   {"costCenter":"24590452","val":"24590452"},
                   {"costCenter":"24590453","val":"24590453"}
];
var Activity = [
                {"activityName":"Select a value","val":""},
                {"activityName":"Relocation","val":"Relocation"},
                {"activityName":"Brand Nestogen","val":"Brand Nestogen"},
                {"activityName":"Brand Cerelac","val":"Brand Cerelac"},
                {"activityName":"Travel","val":"Travel"},
                {"activityName":"Brand Nan","val":"Brand Nan"},
                {"activityName":"SMR","val":"SMR"},
                {"activityName":"Sponsorship","val":"Sponsorship"}
];
//Plane
var Airline = [
               {"preferredAirline":"Select a value","val":""},
               {"preferredAirline":"CebuPAC","val":"CebuPAC"},
               {"preferredAirline":"PAL","val":"PAL"},
               {"preferredAirline":"Air Asia","val":"Air Asia"},
               {"preferredAirline":"Tiger Air","val":"Tiger Air"}
];
//Hotel
var Location = [
                {"location":"Select a value","val":""},
                {"location":"Makati","val":"Makati"},
                {"location":"Quezon City","val":"Quezon City"},
                {"location":"Pasay","val":"Pasay"},
                {"location":"Manila","val":"Manila"},
                {"location":"Las Pinas","val":"Las Pinas"},
                {"location":"Pasig","val":"Pasig"},
                {"location":"Taguig","val":"Taguig"}
];
var Type = [
            {"roomType":"Select a value","val":""},
            {"roomType":"Deluxe","val":"Deluxe"},
            {"roomType":"Premium","val":"Premium"},
            {"roomType":"Intermediate","val":"Intermediate"}
];
var Category = [
                {"roomCategory":"Select a value","val":""},
                {"roomCategory":"Big","val":"Big"},
                {"roomCategory":"Small","val":"Small"},
                {"roomCategory":"Medium","val":"Medium"}
];
//Car
var Description = [
                   {"description":"Select a value","val":""},
                   {"description":"Mitsubishi Lancer","val":"Mitsubishi Lancer"},
                   {"description":"Toyota Fortuner","val":"Toyota Fortuner"},
                   {"description":"Toyota Corolla","val":"Toyota Corolla"},
                   {"description":"Toyota Hilux","val":"Toyota Hilux"}
];
var Duration = [
                {"duration":"Select a value","val":""},
                {"duration":"3 Days","val":"3 Days"},
                {"duration":"2 Days","val":"2 Days"},
                {"duration":"Morning to Evening", "val":"Morning to Evening"}
];
var Details = [
               {"details":"Select a value","val":""},
               {"details":"10 seater","val":"10 seater"},
               {"details":"8 seater","val":"8 seater"},
               {"details":"4 seater","val":"4 seater"}
];
//Registration
var Member = [
               {"membership":"Select a value","val":""},
               {"membership":"Member","val":"Member"},
               {"membership":"Non-Member","val":"Non-Member"}
               ];
//Other
var OtherTable = [
                  {"item":"1","hcpname":"Marck Regio","remarks":"Other Request"},
                  {"item":"2","hcpname":"Mark Stephen Villamar","remarks":"Other Request"},
                  {"item":"3","hcpname":"John Robin Lizaso","remarks":"Other Request"}
];