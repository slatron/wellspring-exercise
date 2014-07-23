jQuery.noConflict();
 
(function($) {

  var $table    = $('#train-table'),
      allTrains = [],
      page      = 1,
      perPage   = 5,
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
      // uses application state vars
      subselectTrains = function() {
        if(page + 4 > allTrains.length) {
          return allTrains.slice(page - 1);
        } else {
          return allTrains.slice(page - 1, page + 4);
        }
      },

      // Setup initial table
      init = function(data) {

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

        // Show total runs
        $('[data-total-runs]').text(allTrains.length);

        // Show first page in pagination
        $('[data-page-current]').text(page);

        // Show total pages in pagination
        $('[data-page-total]').text(Math.ceil(allTrains.length / perPage));

        return false;

      };

  // Get json data
  $.ajax({
    'url'     : 'json/trains.json',
    'dataType': 'json',
    'success' : function(data) {
      // Pass through "data" key of json data
      init(data.data);
    }
  })
 
})(jQuery);