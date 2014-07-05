// Initialize your app
var myApp = new Framework7();

// Export selectors engine
//var $$ = myApp.$;
$(document).ready(function(){
                  $('.requestPage').click(function(){
                                          $('.page3').removeClass('hidden').addClass('shown');
                                          if ($('.page2').hasClass('shown')){
                                          $('.page2').removeClass('shown').addClass('hidden');
                                          }
                                          $('.backer').removeClass('hidden').addClass('shown');
                                          $('.backer').addClass('toPage2');
                                          });
                  $('.backer').click(function(){
                                     if($(this).hasClass('toPage2')){
                                     $('.page2').removeClass('hidden').addClass('shown');
                                        if ($('.page3').hasClass('shown')){
                                        $('.page3').removeClass('shown').addClass('hidden');
                                        }
                                     $('.backer').animate().addClass('hidden').removeClass('shown');
                                     $('.backer').removeClass('toPage2');
                                     }
                                     });
                  });

