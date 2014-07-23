jQuery.noConflict();
 
(function($) {

  $.ajax({
    'url'     : 'json/trains.json',
    'dataType': 'json',
    'success' : function(data) {
      console.log(data);
    }
  })
 
})(jQuery);