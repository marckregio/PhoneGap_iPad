
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
                  
                  $('.menuButton').click(function(){
                                         $('.menu').modal('show');
                                         });
                  $('.exit').click(function(){
                                         $('.menu').modal('hide');
                                         });
                  $('#addRow').click(function(){
                                     $('#otherEntry').modal('show');
                                     });
                  $('.cancelOther').click(function(){
                                     $('#otherEntry').modal('hide');
                                     });
});


