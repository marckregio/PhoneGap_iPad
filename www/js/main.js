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
                  //document.addEventListener("deviceready",createDB,false);
                  $('#submit').click(function(){
                                     $('#loader').modal('show');
                                     setTimeout(function(){
                                                $('#loader').modal('hide');
                                                $('#page1').hide();
                                                $('#page2').fadeIn();
                                                },3000);
                                     setTimeout(function(){
                                                
                                                },3100);
                                     });
                  $('#submit').click(function(){
                                     var id = Math.floor((Math.random() * 100) + 1);
                                     //RunDynamicSQL("Insert Into AccountHandler (id, fullname, mobileno, address) Values (" + id + ",'Marck Litonjua Regio','09276572480','Sauyo QC')");
                                     //RunDynamicSQL("Delete from AccountHandler");
                                     //RunDynamicSQLReturn("Select * from AccountHandler");
                                     });
                  
});


