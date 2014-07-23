jQuery.noConflict();
 
(function($) {

  // ==============================================
  // Initial app state variables
  // ==============================================
  var page      = 1,
      perPage   = 5,
      providers = ['El', 'Metra', 'Amtrak'],
      $table    = $('#train-table'),
      $message  = $('.message'),
      allTrains = [],
      // ==============================================
      // Application methods
      // ==============================================

      // ==============================================
      // updateTable() takes an array of trains
      // and displays them in the main table
      // ==============================================
      updateTable = function(trains) {

        var $rows = $('<tbody></tbody>');

        $message.empty();
        $table.find('tbody').remove();
        $('[data-page-current]').text(page);

        $.each(trains, function(idx, elem) {
          var $newRow = $('<tr></tr>');

          // Set missing values to "Unknown"
          elem.trainLine === "" ? elem.trainLine = "unknown" : null;
          elem.routeName === "" ? elem.routeName = "unknown" : null;
          elem.runNumber === "" ? elem.runNumber = "unknown" : null;
          elem.operatorId === "" ? elem.operatorId = "unknown" : null;

          // Append new cells to detached row
          $newRow.append('<td>' + elem.trainLine  + '</td>');
          $newRow.append('<td>' + elem.routeName  + '</td>');
          $newRow.append('<td>' + elem.runNumber  + '</td>');
          $newRow.append('<td>' + elem.operatorId + '</td>');

          // Append detached new row to detached rows
          $rows.append($newRow);

        });

        // Add empty rows if less than perPage exist
        if(trains.length < perPage) {
          var blankRows = perPage - trains.length;

          for (var i =0; i < blankRows; i++) {
            var $blankRow = $('<tr></tr>');

            // Append new cells to detached row
            $blankRow.append('<td>&nbsp;</td>');
            $blankRow.append('<td>&nbsp;</td>');
            $blankRow.append('<td>&nbsp;</td>');
            $blankRow.append('<td>&nbsp;</td>');

            // Append detached new row to detached rows
            $rows.append($blankRow);

          };
        }

        // Using only one actual DOM append to
        // attach new table for performance optimization
        $table.append($rows);

        return false;
      },

      // ==============================================
      // Sort By Clicked Column
      // ==============================================
      columnSort = function(col) {

        var currentTrains = subselectTrains();

        updateTable(currentTrains.objSort(col));
      },

      // ==============================================
      // subselectTrains() returns the current page 
      // subset of trains determined by state vars
      // ==============================================
      subselectTrains = function() {
        var firstRecord = (page - 1) * perPage;

        // Correct for first page
        firstRecord === -1 ? firstRecord++ : null;

        if(firstRecord + perPage > allTrains.length) {
          return allTrains.slice(firstRecord);
        } else {
          return allTrains.slice(firstRecord, firstRecord + perPage);
        }

        return false;
      },

      // ==============================================
      // Setup initial table values
      // ==============================================
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

        updateTable(subselectTrains());

        // Initialize numnerical values on page
        $('[data-total-runs]').text(allTrains.length);
        $('[data-page-current]').text(page);
        $('[data-page-total]').text(Math.ceil(allTrains.length / perPage));

        return false;

      },

      // ==============================================
      // showMsg() displays user messages
      // ==============================================
      showMsg = function(msg) {
        $message.empty().text(msg);
      },

      // ==============================================
      // paginate() handles pagination arrows
      // ==============================================
      paginate = function(dir) {
        var doUpdate = false,
            msg;

        switch(dir) {
          case 'right':
            var nextIndex = ((page - 1) * perPage) + perPage;

            if ( nextIndex < allTrains.length ) {
              page++;
              doUpdate = true;
            } else {
              msg = "There are no more trains to show. Please click the left arrow to view more trains.";
            }
            break;
          case 'left':
            if ( page !== 1 ) {
              page--;
              doUpdate = true;
            } else {
              msg = "You are already viewing the first page of trains. Please click the right arrow to view more trains.";
            }
            break;
          default:
            msg = "We're sorry, an error has occured during pagination. Please try again."
        }
        
        // Update display or show error message
        doUpdate ? updateTable(subselectTrains()) : showMsg(msg);

        return false;

      };

  // ==============================================
  // Initial ajax call for json data
  // ==============================================
  $.ajax({
    'url'     : 'json/trains.json',
    'dataType': 'json',
    'success' : function(data) {
      // Pass through "data" key of json data
      init(data.data);
    }
  })

  // ==============================================
  // Attach event listeners
  // ==============================================

  // Using event delegation for attaching similar events
  $('.pagination').on('click', 'i', function() {
    var $this = $(this);

    paginate($this.data('page'));

    return false;
  })

  $table.on('click', 'th', function() {
    var $this = $(this);

    columnSort($this.data('sort'));

    return false;
  })

 
})(jQuery);




