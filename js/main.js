jQuery.noConflict();
 
(function($) {

  var $table    = $('#train-table'),
      allTrains = [],
      page      = 1,
      providers = ['El', 'Metra', 'Amtrak'],

      // Update table takes an array of trains
      // and displays them in the main table
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

        return false;
      },

      // return current page subset of trains
      // uses current application state data
      subselectTrains = function() {
        if(page + 4 > allTrains.length) {
          return allTrains.slice(page - 1);
        } else {
          return allTrains.slice(page - 1, page + 4);
        }
      },

      loadInitialTrains = function(data) {

        // Sanitize data by removing unrecognized providers
        var sanitizedData = $.map(data, function(elem) {
          if(providers.indexOf(elem.trainLine) > -1) {
            return elem;
          } else {
            return null;
          }
        });

        allTrains = sanitizedData;

        // Move this to function that returns current page
        updateTable(subselectTrains());

        // Show total rows in pagination
        $('[data-page-total]').text(allTrains.length);

        // Show first page in pagination
        $('[data-page-current]').text('1');

        return false;

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