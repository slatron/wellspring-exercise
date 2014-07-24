jQuery.noConflict();
 
(function($) {

  // ==================================================================
  // Initial app state variables
  //
  // page:           starting page for application
  // perPage:        number of records per page
  // lines:      Allowed companies for sanitizing data & filtering
  // allTrains:      All sanitized train data form json call
  // filteredTrains: Current filtered array of trains to show
  // ==================================================================
  var page           = 1,
      perPage        = 5,
      lines          = ['El', 'Metra', 'Amtrak'],
      allTrains      = [],
      filteredTrains = [],

      // ==============================================
      // Cached jQuery Objects
      // ==============================================
      $table   = $('#train-table'),
      $message = $('#message'),
      $filters = $('#filters'),
      $cbs     = $filters.find('input'),

      // ==============================================
      // Application methods
      // ==============================================

      // ==============================================
      // updateTable() takes an array of trains
      // and displays them in the main table
      // ==============================================
      updateTable = function(trains) {

        var $rows = $('<tbody></tbody>');

        $message.removeClass('active');
        $table.find('tbody').remove();
        $('[data-total-runs]').text(filteredTrains.length);
        $('[data-page-current]').text(page);
        $('[data-page-total]').text(Math.ceil(filteredTrains.length / perPage));

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
      columnSort = function(col, reverse) {

        reverse = reverse || false;

        var currentTrains = subselectTrains();

        if(!reverse) {
          updateTable(currentTrains.objSort(col));
        } else {
          updateTable(currentTrains.objSort(col, -1));
        }

        return false;
      },

      // ==============================================
      // subselectTrains() returns the current page 
      // subset of trains determined by state vars
      // ==============================================
      subselectTrains = function() {
        var firstRecord = (page - 1) * perPage;

        // Correct for first page
        firstRecord === -1 ? firstRecord++ : null;

        if(firstRecord + perPage > filteredTrains.length) {
          return filteredTrains.slice(firstRecord);
        } else {
          return filteredTrains.slice(firstRecord, firstRecord + perPage);
        }

        return false;
      },

      // ===================================================
      // Return subset of trains based on current lines
      // ===================================================
      sanitizeData = function(data) {

        var result;

        // Sanitize data by removing unrecognized train lines
        result = $.map(data, function(elem) {
          if(lines.indexOf(elem.trainLine) > -1) {
            return elem;
          } else {
            return null;
          }
        });

        // tempResult will use the objects in the arrays as
        // strings for the keys. This will cause duplicate
        // entries to overwrite themselves in the temp array
        var tempResult = {};
        for (var i = 0, n = result.length; i < n; i++) {
            var item = result[i];
            tempResult[ item.trainLine + " - " + item.routeName + " - " + item.runNumber + " - " + item.operatorId ] = item;
        }

        // then, use the new array to populate
        // the final return array
        var i = 0,
            nonDuplicatedArray = [];    
        for(var item in tempResult) {
            nonDuplicatedArray[i++] = tempResult[item];
        }

        return nonDuplicatedArray;

      },

      // ==============================================
      // Setup initial table values
      // ==============================================
      init = function(data, refresh) {

        refresh = refresh || false;
        page = 1;

        if(!refresh) {
          // Store initial trains array
          allTrains = sanitizeData(data);

          // Clone allTrains to filteredTrains with slice trick
          // This prevents filteredTrains from referencing allTrains
          filteredTrains = allTrains.slice(0);
        } else {
          filteredTrains = data;
        }

        // Start by displaying all trains
        updateTable(subselectTrains());

        // Initialize numnerical values on page
        $('[data-total-runs]').text(filteredTrains.length);
        $('[data-page-current]').text(page);
        $('[data-page-total]').text(Math.ceil(filteredTrains.length / perPage));

        return false;

      },

      // ==============================================
      // showMsg() displays user messages
      // ==============================================
      showMsg = function(msg) {

        var $text = $('<p>' + msg + '</p>');

        $message.empty()
                .append($text)
                .addClass('active');

        return false;
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

            if ( nextIndex < filteredTrains.length ) {
              page++;
              doUpdate = true;
            } else {
              msg = "There are no more trains to show.";
              if (page > 1) {
                msg +=" Please click the left arrow to view more trains.";
              }
            }
            break;
          case 'left':
            if ( page !== 1 ) {
              page--;
              doUpdate = true;
            } else {
              msg = "You are already viewing the first page of trains.";
              if (page > 1) {
                msg +=" Please click the right arrow to view more trains.";
              }
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
  });

  // ==============================================
  // Keyboard pagination
  // ==============================================
  $(document).keydown(function (e) { 

    if (e.keyCode == 37 || e.keyCode == 40) {
        paginate('left');
    } else if (e.keyCode == 39 || e.keyCode == 38) {
        paginate('right');
    }

  });

  // ==============================================
  // Table Column Sorting
  // ==============================================
  $table.on('click', 'th', function() {
    var $this = $(this);

    // If this column is already sorted, perform a reverse sort
    if($this.hasClass('sorted')) {

      $this.removeClass('sorted');
      columnSort($this.data('sort'), true);

    } else {

      $this.addClass('sorted');
      $this.siblings().removeClass('sorted');
      columnSort($this.data('sort'));

    }

    return false;
  })

  // ==============================================
  // Filter Buttons
  // ==============================================
  $filters.on('change', 'input', function() {

    if($cbs.filter(':checked').length > 0) {

      lines.length = 0;

      $.each($cbs, function(idx, elem) {
        var $this = $(this);

        if($this.is(':checked')) {
          lines.push($this.attr('name'));
        } 

      });

      // Refilter data using new lines array
      filteredTrains = sanitizeData(allTrains);

      // Re-initialize Application with Filtered Data
      init(filteredTrains, true);

    } else {

      $(this).prop('checked', true);
      showMsg("You need to leave at least one train line checked to see results.");

    }

    return false;

  });

  // ==============================================
  // New Record Form Processing
  // ==============================================
  $('a[data-submit]').on('click', function(e) {
    e.preventDefault();

    var newroute = $('#new-route').val(),
        newrun   = $('#new-run').val(),
        newid    = $('#new-id').val();

    newroute.length > 0 ? null : newroute = "unknown";
    newrun.length > 0 ? null : newrun = "unknown";
    newid.length > 0 ? null : newid = "unknown";

    var newRecord = {};

    newRecord.trainLine  = $('#new-line').val();
    newRecord.routeName  = newroute;
    newRecord.runNumber  = newrun;
    newRecord.operatorId = newid;

    // Add new record to current and future results
    filteredTrains.push(newRecord);
    allTrains.push(newRecord);

    // Reinitialize table
    init(filteredTrains, true);

  });

  // ==============================================
  // Mobile menu icon 
  // ==============================================
  $('.menu-icon').on('click', function() {
    $filters.toggleClass('active');
  });

})(jQuery);
