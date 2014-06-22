$(document).ready(
function(){
                  $('.requestType').click(function(){
                                          var closestClass = "."+$(this).attr('id');
                                          var closestId = "#"+$(this).attr('id');
                                          $('.btn').removeClass('active');
                                          $('.btn').removeClass('btn-info');
                                          $(closestId).addClass('btn-info');
                                          $('.requestItem').hide();
                                          $(closestClass).fadeIn('fast');
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
                                     var id = Math.floor((Math.random() * 100) + 1);
                                     //RunDynamicSQL("Insert Into AccountHandler (id, fullname, mobileno, address) Values (" + id + ",'"+ $('.fullname').val() + "','" + $('.mobileno').val() + "','" + $('.address').val() + "')");
                                     //RunDynamicSQL("Delete from AccountHandler");
                                     //RunDynamicSQLReturn("Select * from AccountHandler");
                                     });
                  $('.registeredUser').text() = currentUser;
});


