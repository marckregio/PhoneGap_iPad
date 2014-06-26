$(document).ready(
function(){
                  //ALL EVENT RELATED
                  //Assign Variables
                  refNo = $('.referenceNo').text();
                  requestor = $('.registeredUser').text();
                  mobileno = $('.mobileNo').text();
                  dateofBirth = $('.dateOfBirth').text();
                  //Bind JSON to UI
                  for (var i = 0; i < Activity.length; i++){
                  $('.activityName').append('<option value="' + Activity[i].val + '">' + Activity[i].activityName + '</option>');
                  }
                  for (var i = 0; i < Accounts.length; i++){
                  $('.accountNo').append('<option value="' + Accounts[i].val + '">' + Accounts[i].accountNo + '</option>');
                  }
                  for (var i = 0; i < CostCenters.length; i++){
                  $('.costCenter').append('<option value="' + CostCenters[i].val + '">' + CostCenters[i].costCenter + '</option>');
                  }
                  for (var i = 0; i < Airline.length; i++){
                  $('.airline').append('<option value="' + Airline[i].val + '">' + Airline[i].preferredAirline + '</option>');
                  }
                  for (var i = 0; i < Location.length; i++){
                  $('.location').append('<option value="' + Location[i].val + '">' + Location[i].location + '</option>');
                  }
                  for (var i = 0; i < Type.length; i++){
                  $('.roomType').append('<option value="' + Type[i].val + '">' + Type[i].roomType + '</option>');
                  }
                  for (var i = 0; i < Category.length; i++){
                  $('.category').append('<option value="' + Category[i].val + '">' + Category[i].roomCategory + '</option>');
                  }
                  for (var i = 0; i < Description.length; i++){
                  $('.description').append('<option value="' + Description[i].val + '">' + Description[i].description + '</option>');
                  }
                  for (var i = 0; i < Duration.length; i++){
                  $('.duration').append('<option value="' + Duration[i].val + '">' + Duration[i].duration + '</option>');
                  }
                  for (var i = 0; i < Details.length; i++){
                  $('.carDetails').append('<option value="' + Details[i].val + '">' + Details[i].details + '</option>');
                  }
                  for (var i = 0; i < Member.length; i++){
                  $('.membership').append('<option value="' + Member[i].val + '">' + Member[i].membership + '</option>');
                  }
                  for (var i = 0; i < Passenger.length; i++){
                  $('.guestName').append('<option value="' + Passenger[i].passengerName + '">' + Passenger[i].passengerName + '</option>');
                  }
                  for (var i = 0; i < Passenger.length; i++){
                  $('.hcpName').append('<option value="' + Passenger[i].passengerName + '">' + Passenger[i].passengerName + '</option>');
                  }
                  for (var i = 0; i < Passenger.length; i++){
                  $('.planePassenger').append('<option value="' + Passenger[i].passengerName + '">' + Passenger[i].passengerName + '</option>');
                  }
                  for (var i = 0; i < Passenger.length; i++){
                  $('.carPassenger').append('<option value="' + Passenger[i].passengerName + '">' + Passenger[i].passengerName + '</option>');
                  }
                  for (var i = 0; i < OtherTable.length; i++){
                  $('#otherRows').append('<tr class="selectedRow">\
                                         <td>' + OtherTable[i].item + '</td> \
                                         <td>' + OtherTable[i].hcpname + '</td> \
                                         <td>' + OtherTable[i].remarks + '</td> \
                                         </tr>');
                  }
                  
                  $('select').change(function(){
                                     
                                      activityName = $('.activityName').val();
                                      accountNo = $('.accountNo').val();
                                      costCenter = $('.costCenter').val();
                                      //
                                      planePassenger = $('.planePassenger').val();
                                      airline = $('.airline').val();
                                      //
                                      guestName = $('.guestName').val();
                                      roomlocation = $('.location').val();
                                      roomType = $('.roomType').val();
                                      category = $('.category').val();
                                      //
                                      carPassenger = $('.carPassenger').val();
                                      description = $('.description').val();
                                      duration = $('.duration').val();
                                      carDetails = $('.carDetails').val();
                                      //
                                      hcpName = $('.hcpName').val();
                                      membership = $('.membership').val();
                                      prcNo = $('.prcNo').text();
                                      mailing = $('.mailing').text();
                                      email = $('.email').text();
                                     
                                     });
                                      //
                                     /*
                                      hcpName2 = $('.hcpName2').val();
                                      hcpMobile = $('.hcpMobile').text();
                                      });
                                      */
                  $('.dateofActivity').change(function(){
                                              dateofActivity = $('.dateofActivity').val();
                                              //alert(dateofActivity);
                                       });
                  
                  
                  
                  $('#submit').click(function(){
                                     $('#loader').modal('show');
                                     setTimeout(function(){
                                                $('#loader').modal('hide');
                                                $('#page1').hide();
                                                $('#page2').fadeIn();
                                                },3000);
                                     });
                  $('#submit').click(function(){
                                     //RunDynamicSQL("Insert Into AccountHandler (id, fullname, mobileno, address) Values (" + id + ",'"+ $('.fullname').val() + "','" + $('.mobileno').val() + "','" + $('.address').val() + "')");
                                     //RunDynamicSQL("Delete from AccountHandler");
                                     //RunDynamicSQLReturn("Select * from AccountHandler");
                                     });
                  if (requestor != ""){
                  $('#page1').hide();
                  $('#page2').hide();
                  $('#page3').show();
                  }
                  $('.genXML').click(function(){
                                     requestAccess();
                                     //constructor();
                                     });
                  var closestTr;
                  $('.selectedRow').click(function(){
                                          closestTr = $(this).closest('tr');
                                          if ($(closestTr).hasClass("selected") == true){
                                          $(closestTr).removeClass("selected");
                                          } else {
                                          $(closestTr).addClass("selected");
                                          }
                                          });
                  $('#deleteRow').click(function(){
                                        if ($(closestTr).hasClass("selected") == true){
                                        $('.selected').remove();
                                        }
                                        });
                  $('.saveOther').click(function(){
                                        var item = $('#otherTable tr').size();
                                        $('#otherRows').append('<tr class="selectedRow">\
                                                               <td>' + item + '</td> \
                                                               <td>' + $('#hcpName2').val() + '</td> \
                                                               <td>' + $('#remarks').val()  + '</td> \
                                                               </tr>');
                                        $('#otherEntry').modal('hide');
                                        $('#hcpName2').val("");
                                        $('#remarks').val("");
                                        });
                  function constructor(){
                  var array = [];
                  var header = [];
                  $('#otherTable th').each(function(index, item){
                                           header[index] = $(item).html();
                                           });
                  $('#otherTable tr').has('td').each(function(index, item){
                                                     var items = {};
                                                     $('td', $(this)).each(function(index, item){
                                                                           items[header[index]] = $(item).html();
                                                                           });
                                                     array.push(items);
                                                     });
                  var tba = JSON.stringify(array);
                  alert(tba[0].HCPName);
                  }
});

