jQuery.noConflict();
 
(function($) {

  var $table = $('#train-table'),
      allTrains = {},
      page   = 1,

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
        allTrains = data;
        updateTable(allTrains);
      };

  $.ajax({
    'url'     : 'json/trains.json',
    'dataType': 'json',
    'success' : function(data) {
      loadInitialSchedule(data);
    }
  })
 
})(jQuery);