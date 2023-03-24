$(document).ready(function () {
    $('#changeRunningText').click(function (e) {
        const changesRunningText = $('#changeInput').val();
        const data = {
            runningText: changesRunningText
        }
        $.ajax({
            url: '/updateRunningText',
            type: 'post',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function () {
                location.reload();
                console.log("Data updated successfully.");
            }
        });
    });


    $('.changesImg').click(function (data) {
        const id = $(this).attr('id');
        $('#myModal').modal('show');

        $.ajax({
            url: '/list-files',
            method: 'GET',
            success: function (data) {
                var totalPages = Math.ceil(data.length / 5); // Set the number of pages based on the number of files and the number of files displayed per page (10 in this example)
                $('#pagination').twbsPagination({
                    totalPages: totalPages,
                    visiblePages: 5,
                    onPageClick: function (event, page) {
                        var startIndex = (page - 1) * 5;
                        var endIndex = Math.min(startIndex + 5, data.length);
                        var pageData = data.slice(startIndex, endIndex);
                        var pageList = '';
                        pageData.forEach(function (file) {
                            pageList += '<a href="#" class="list-group-item list-group-item-action">' + file.filename + '</a>';
                        });
                        $('#fileList').html(pageList);
                    }
                });
                $('.list-group').on('click', '.list-group-item', function (event) {
                    // alert('/public/images/' + $(this).text())
                    const newData = {
                        filename: $(this).text(),
                        filepath: '/public/images/' + $(this).text()
                    };
                    $.getJSON('./public/data/media.json', function (data) {
                        data.file[id] = newData;
                        $.ajax({
                            url: '/updateMediaSlide',
                            type: 'post', // or 'POST'
                            data: JSON.stringify(data),
                            contentType: 'application/json',
                            success: function (response) {
                                location.reload();
                                console.log('JSON file updated successfully.');
                            },
                            error: function (xhr, status, error) {
                                console.error('Error updating JSON file: ' + error);
                            }
                        });
                    });
                });
            },
            error: function (xhr, status, error) {
                console.error('Error getting list of files: ' + error);
            }
        });
    });

    $('.upload').click(function (e) { 
        e.preventDefault();
        $('#uploadFIle').modal('show');
        
        $('#uploadForm').submit(function(e) {
            e.preventDefault();
            var formData = new FormData(this);
            $.ajax({
                url: '/upload',
                type: 'POST',
                data: formData,
                xhr: function() {
                  var xhr = new window.XMLHttpRequest();
                  xhr.upload.addEventListener('progress', function(evt) {
                    if (evt.lengthComputable) {
                      var percentComplete = evt.loaded / evt.total * 100;
                      $('.progress-bar').css('width', percentComplete + '%').text(percentComplete.toFixed(0) + '%');
                    }
                  }, false);
                  return xhr;
                },
                success: function(data) {
                  // Show success notification
                  $('.alert-success').show().delay(2000).fadeOut(function() {
                    setTimeout(function() {
                      location.reload();
                    }, 500);
                  });
                },
                error: function(xhr, status, error) {
                  // Show error notification
                  $('.alert-danger').show().delay(2000).fadeOut();
                },
                cache: false,
                contentType: false,
                processData: false
              });
         });
    });

    $('.delete').click(function (e) { 
        e.preventDefault();
        $('#myModal').modal('show');

        $.ajax({
            url: '/list-files',
            method: 'GET',
            success: function (data) {
                var totalPages = Math.ceil(data.length / 5); // Set the number of pages based on the number of files and the number of files displayed per page (10 in this example)
                $('#pagination').twbsPagination({
                    totalPages: totalPages,
                    visiblePages: 5,
                    onPageClick: function (event, page) {
                        var startIndex = (page - 1) * 5;
                        var endIndex = Math.min(startIndex + 5, data.length);
                        var pageData = data.slice(startIndex, endIndex);
                        var pageList = '';
                        pageData.forEach(function (file) {
                            pageList += '<a href="#" class="list-group-item list-group-item-action deleteItem">' + file.filename + '</a>';
                        });
                        $('#fileList').html(pageList);
                    }
                });
                $('.list-group').on('click', '.deleteItem', function (event) {
                    // alert('/public/images/' + $(this).text())
                    const newData = {
                        filepath: '/public/images/' + $(this).text()
                    };
                    $.ajax({
                        url: '/deleteFile',
                        type: 'post', // or 'POST'
                        data: JSON.stringify(newData),
                        contentType: 'application/json',
                        success: function (response) {
                            location.reload();
                            console.log('File has been deleted');
                        },
                        error: function (xhr, status, error) {
                            console.error('Error while deleting file ' + error);
                        }
                    });
                });
            },
            error: function (xhr, status, error) {
                console.error('Error getting list of files: ' + error);
            }
        });
    });
    
    $('.view').click(function (e) { 
        e.preventDefault();
        $('#myModal').modal('show');
        
        $.ajax({
            url: '/list-files',
            method: 'GET',
            success: function (data) {
                var totalPages = Math.ceil(data.length / 5); // Set the number of pages based on the number of files and the number of files displayed per page (10 in this example)
                $('#pagination').twbsPagination({
                    totalPages: totalPages,
                    visiblePages: 5,
                    onPageClick: function (event, page) {
                        var startIndex = (page - 1) * 5;
                        var endIndex = Math.min(startIndex + 5, data.length);
                        var pageData = data.slice(startIndex, endIndex);
                        var pageList = '';
                        pageData.forEach(function (file) {
                            pageList += '<a href="#" class="list-group-item list-group-item-action deleteItem">' + file.filename + '</a>';
                        });
                        $('#fileList').html(pageList);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error('Error getting list of files: ' + error);
            }
        });
    });
});