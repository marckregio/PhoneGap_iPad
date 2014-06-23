
$(document).ready(
function(){
                  //ALL UI Related
                  $('.requestType').click(function(){
                                          var closestClass = "."+$(this).attr('id');
                                          var closestId = "#"+$(this).attr('id');
                                          $('.btn').removeClass('active');
                                          $('.btn').removeClass('btn-info');
                                          $(closestId).addClass('btn-info');
                                          $('.requestItem').hide();
                                          $(closestClass).fadeIn('fast');
                                          });
                  
                  $('.registeredUser').text("Marck Litonjua Regio");
                  $('.mobileNo').text("09276572480");
                  $('.dateOfBirth').text("March 10, 1994");
                  $('.referenceNo').text(id + "-213441");
                  
                  
});


