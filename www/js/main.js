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
                                                },3000);
                                     setTimeout(function(){
                                                window.location.assign("App.html");
                                                },3500);
                                     });
});


