$(document).ready(function () {
    $("#timeline-list, #left-list").sortable({
        connectWith: ".connectedSortable", cursor: "pointer", opacity: 0.60, containment: "document",
        update: function () {
            $('#present-photos').empty();
            var arrayIdPhotos = new Array();
            var timelineList = $("#timeline-list > li").toArray();

            for (var i = 0; i < timelineList.length; i++) {
                arrayIdPhotos.push($(timelineList[i]).children("img").attr("id"));
            }

            for (var i = 0; i < arrayIdPhotos.length; i++) {
                $('#present-photos').append("<input type=\"hidden\" name=\"" + arrayIdPhotos[i] + "\" value=\"" + arrayIdPhotos[i] + "\" />");
            }
        }
    }).disableSelection();

    $(".left-list-item").click(function () {
        $("#preview-window").attr("src", $(this).attr("src"));
        $("#preview-window").attr("name", $(this).attr("id"));
        $('#namePhoto').attr("value", $(this).attr("name"));
        $('#descriptionPhoto').text($(this).attr("desc"));
    });

    $("#gray-scale-effect").click(function () {
        $("#preview-window").attr("src", "http://res.cloudinary.com/cerber/image/upload/e_grayscale/" + $("#preview-window").attr("name") + ".jpg");
    });

    $("#contrast-effect").click(function () {
        $("#preview-window").attr("src", "http://res.cloudinary.com/cerber/image/upload/e_contrast:100/" + $("#preview-window").attr("name") + ".jpg");
    });

    $("#blur-effect").click(function () {
        $("#preview-window").attr("src", "http://res.cloudinary.com/cerber/image/upload/e_blur/" + $("#preview-window").attr("name") + ".jpg");
    });

    $("#negate-effect").click(function () {
        $("#preview-window").attr("src", "http://res.cloudinary.com/cerber/image/upload/e_negate/" + $("#preview-window").attr("name") + ".jpg");
    });

    var speed = 1000;
    $("#render").click(function () {
        var timelineList = $("#timeline-list > li").toArray();

        var arraySrcImages = new Array();
        for (var i = 0; i < timelineList.length; i++) {
            arraySrcImages[i] = $(timelineList[i]).children("img").attr("src");
        }

        var track = $("#track");
        for (var i = 0; i < arraySrcImages.length; i++)
            track.append("<img src=\"" + arraySrcImages[i] + "\" />");

        var arrayImages = $('#track img');
        var timelineWidth = 0;
        for (var i = 0; i < arrayImages.length; i++) {
            timelineWidth += $(arrayImages[i]).width();
        }

        $("#track").width(timelineWidth);

        var width = $('#track img').width();

        $('#render-dialog').dialog({
            height: 654,
            width: 520,
            modal: true,
            buttons: {
                'Play': function () {
                    play = true;
                    carousel();
                },

                'Pause': function () {
                    play = false;
                },

                'Close': function () {
                    play = false;
                    track.empty();
                    $(this).dialog("close");
                }
            }
        });

        var play = true;
        function carousel() {
            if (!play)
                return;

            $('#track').delay(speed).animate({ right: '+=' + width }, 3000, function () {
                var first = $('#track img:first-child');

                first.remove();

                $(this).append(first);

                $(this).css({ right: '-=' + width });

                carousel();
            });
        }

        carousel();
    });

    $('#fileUpload').on('change', function () {
        $('#upload').click();
    });

    $("#left-bar").tabs();
    $("#right-bar").tabs();

    $('#apply-speed-slider').click(function () {
        if ($.isNumeric($('#speed-slider').val())) {
            speed = $('#speed-slider').val();
        }
    });

    $('#speed-slider').val(speed);

    $('#render-dialog').hide();

    $('#url-file-update').click(function (e) {
        e.preventDefault();
        var url = $('#url-file-link').val();

        $.post('@Url.Action("UploadEx", "Home")', "url=" + url.toString(), function () {

        });
    });

    $(".right-list-item").click(function (e) {
        e.preventDefault();
        var url = $(this).attr("src");

        $.get('@Url.Action("Manager", "Home")', "url=" + url.toString(), function (data) {
            var array = jQuery.parseJSON(data);
            $('#timeline-list').empty();
            for (var i = 0; i < array.length; i++) {
                $('#timeline-list').append("<li><img class=\"left-list-item img-thumbnail\" src=\"" + array[i].PhotoPath + "\" /></li>");
            }
        });
    });
});