$(document).ready(
function(){
                  //ALL EVENT RELATED
                  //Assign Variables
                  refNo = $('.referenceNo').text();
                  requestor = $('.registeredUser').text();
                  mobileno = $('.mobileNo').text();
                  dateofBirth = $('.dateOfBirth').text();
                  
                  $('select').change(function(){
                                      activityName = $('.activityName').val();
                                      accountNo = $('.accountNo').val();
                                      costCenter = $('.costCenter').val();
                                      //
                                      title = $('.title').val();
                                      airline = $('.airline').val();
                                      //
                                      guestName = $('.guestName').val();
                                      roomlocation = $('.location').val();
                                      roomType = $('.roomType').val();
                                      category = $('.category').val();
                                      //
                                      description = $('.description').val();
                                      duration = $('.duration').val();
                                      carDetails = $('.carDetails').val();
                                      //
                                      hcpName = $('.hcpName').val();
                                      membership = $('.membership').val();
                                      prcNo = $('.prcNo').text();
                                      mailing = $('.mailing').text();
                                      email = $('.email').text();
                                      //
                                      hcpName2 = $('.hcpName2').val();
                                      hcpMobile = $('.hcpMobile').text();
                                      });
                  $('.remarks').change(function(){
                                       remarks = $('.remarks').val();
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
                  $('#page2').show();
                  }
                  $('.genXML').click(function(){
                                     requestAccess();
                                     });
});

