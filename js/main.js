jQuery.noConflict();
 
(function($) {

  var $table    = $('#train-table'),
      allTrains = [],
      page      = 1,

      updateTable = function(trains) {

        $table.find('tbody').remove();

        var $rows = $('<tbody></tbody>');

        $.each(trains, function(idx, elem) {
          var $newRow = $('<tr></tr>');

          $newRow.append('<td>' + elem.trainLine + '</td>');
          $newRow.append('<td>' + elem.routeName + '</td>');
          $newRow.append('<td>' + elem.runNumber + '</td>');
          $newRow.append('<td>' + elem.operatorId + '</td>');

          $rows.append($newRow);

        });

        $table.append($rows);
      },

      loadInitialSchedule = function(data) {

        // Sanitize data by removing unrecognized providers
        var providers = ['El', 'Metra', 'Amtrak'];

        var sanitizedData = $.map(data, function(elem) {
          if(providers.indexOf(elem.trainLine) > -1) {
            return elem;
          } else {
            return null;
          }
        });

        allTrains = sanitizedData;
        updateTable(allTrains);
      };

  // Get json data
  $.ajax({
    'url'     : 'json/trains.json',
    'dataType': 'json',
    'success' : function(data) {
      // Pass through "data" key of json data
      loadInitialSchedule(data.data);
    }
  })
 
})(jQuery);