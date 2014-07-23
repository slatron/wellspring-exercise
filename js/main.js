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

      loadInitialTrains = function(data) {

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

        // Move this to function that returns current page
        updateTable(allTrains.slice(page - 1, page + 4));

        // Show total rows in pagination
        $('[data-page-total]').text(allTrains.length);

        // Show first page in pagination
        $('[data-page-current]').text('1');

      };

  // Get json data
  $.ajax({
    'url'     : 'json/trains.json',
    'dataType': 'json',
    'success' : function(data) {
      // Pass through "data" key of json data
      loadInitialTrains(data.data);
    }
  })
 
})(jQuery);