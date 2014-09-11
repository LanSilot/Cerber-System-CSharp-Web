(function() {
  $(document).ready(function() {
    var speed;
    $("#timeline-list, #left-list").sortable({
      connectWith: ".connectedSortable",
      cursor: "pointer",
      opacity: 0.60,
      containment: "document",
      update: function() {
        var arrayIdPhotos, i, timelineList;
        $("#present-photos").empty();
        arrayIdPhotos = new Array();
        timelineList = $("#timeline-list > li").toArray();
        i = 0;
        while (i < timelineList.length) {
          arrayIdPhotos.push($(timelineList[i]).children("img").attr("id"));
          i++;
        }
        i = 0;
        while (i < arrayIdPhotos.length) {
          $("#present-photos").append("<input type=\"hidden\" name=\"" + arrayIdPhotos[i] + "\" value=\"" + arrayIdPhotos[i] + "\" />");
          i++;
        }
      }
    }).disableSelection();
    $(".left-list-item").click(function() {
      $("#preview-window").attr("src", $(this).attr("src"));
      $("#preview-window").attr("name", $(this).attr("id"));
      $("#namePhoto").attr("value", $(this).attr("name"));
      $("#descriptionPhoto").text($(this).attr("desc"));
    });
    $("#gray-scale-effect").click(function() {
      $("#preview-window").attr("src", "http://res.cloudinary.com/cerber/image/upload/e_grayscale/" + $("#preview-window").attr("name") + ".jpg");
    });
    $("#contrast-effect").click(function() {
      $("#preview-window").attr("src", "http://res.cloudinary.com/cerber/image/upload/e_contrast:100/" + $("#preview-window").attr("name") + ".jpg");
    });
    $("#blur-effect").click(function() {
      $("#preview-window").attr("src", "http://res.cloudinary.com/cerber/image/upload/e_blur/" + $("#preview-window").attr("name") + ".jpg");
    });
    $("#negate-effect").click(function() {
      $("#preview-window").attr("src", "http://res.cloudinary.com/cerber/image/upload/e_negate/" + $("#preview-window").attr("name") + ".jpg");
    });
    speed = 1000;
    $("#render").click(function() {
      var arrayImages, arraySrcImages, carousel, i, play, timelineList, timelineWidth, track, width;
      carousel = function() {
        if (!play) {
          return;
        }
        $("#track").delay(speed).animate({
          right: "+=" + width
        }, 3000, function() {
          var first;
          first = $("#track img:first-child");
          first.remove();
          $(this).append(first);
          $(this).css({
            right: "-=" + width
          });
          carousel();
        });
      };
      timelineList = $("#timeline-list > li").toArray();
      arraySrcImages = new Array();
      i = 0;
      while (i < timelineList.length) {
        arraySrcImages[i] = $(timelineList[i]).children("img").attr("src");
        i++;
      }
      track = $("#track");
      i = 0;
      while (i < arraySrcImages.length) {
        track.append("<img src=\"" + arraySrcImages[i] + "\" />");
        i++;
      }
      arrayImages = $("#track img");
      timelineWidth = 0;
      i = 0;
      while (i < arrayImages.length) {
        timelineWidth += $(arrayImages[i]).width();
        i++;
      }
      $("#track").width(timelineWidth);
      width = $("#track img").width();
      $("#render-dialog").dialog({
        height: 654,
        width: 520,
        modal: true,
        buttons: {
          Play: function() {
            var play;
            play = true;
            carousel();
          },
          Pause: function() {
            var play;
            play = false;
          },
          Close: function() {
            var play;
            play = false;
            track.empty();
            $(this).dialog("close");
          }
        }
      });
      play = true;
      carousel();
    });
    $("#fileUpload").on("change", function() {
      $("#upload").click();
    });
    $("#left-bar").tabs();
    $("#right-bar").tabs();
    $("#apply-speed-slider").click(function() {
      if ($.isNumeric($("#speed-slider").val())) {
        speed = $("#speed-slider").val();
      }
    });
    $("#speed-slider").val(speed);
    $("#render-dialog").hide();
    $("#url-file-update").click(function(e) {
      var url;
      e.preventDefault();
      url = $("#url-file-link").val();
      $.post("@Url.Action(\"UploadEx\", \"Home\")", "url=" + url.toString(), function() {});
    });
    $(".right-list-item").click(function(e) {
      var url;
      e.preventDefault();
      url = $(this).attr("src");
      $.get("@Url.Action(\"Manager\", \"Home\")", "url=" + url.toString(), function(data) {
        var array, i;
        array = jQuery.parseJSON(data);
        $("#timeline-list").empty();
        i = 0;
        while (i < array.length) {
          $("#timeline-list").append("<li><img class=\"left-list-item img-thumbnail\" src=\"" + array[i].PhotoPath + "\" /></li>");
          i++;
        }
      });
    });
  });

}).call(this);

//# sourceMappingURL=CoffeeScript.js.map
