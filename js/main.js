jQuery.noConflict();
 
(function($) {

  var trains = {},
      loadInitialSchedule = function(data) {
        trains = data;
        console.log(trains);
      }

  $.ajax({
    'url'     : 'json/trains.json',
    'dataType': 'json',
    'success' : function(data) {
      loadInitialSchedule(data);
    }
  })
 
})(jQuery);