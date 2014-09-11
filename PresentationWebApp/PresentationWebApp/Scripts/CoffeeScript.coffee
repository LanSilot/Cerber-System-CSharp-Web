$(document).ready ->
  $("#timeline-list, #left-list").sortable(
    connectWith: ".connectedSortable"
    cursor: "pointer"
    opacity: 0.60
    containment: "document"
    update: ->
      $("#present-photos").empty()
      arrayIdPhotos = new Array()
      timelineList = $("#timeline-list > li").toArray()
      i = 0

      while i < timelineList.length
        arrayIdPhotos.push $(timelineList[i]).children("img").attr("id")
        i++
      i = 0

      while i < arrayIdPhotos.length
        $("#present-photos").append "<input type=\"hidden\" name=\"" + arrayIdPhotos[i] + "\" value=\"" + arrayIdPhotos[i] + "\" />"
        i++
      return
  ).disableSelection()
  $(".left-list-item").click ->
    $("#preview-window").attr "src", $(this).attr("src")
    $("#preview-window").attr "name", $(this).attr("id")
    $("#namePhoto").attr "value", $(this).attr("name")
    $("#descriptionPhoto").text $(this).attr("desc")
    return

  $("#gray-scale-effect").click ->
    $("#preview-window").attr "src", "http://res.cloudinary.com/cerber/image/upload/e_grayscale/" + $("#preview-window").attr("name") + ".jpg"
    return

  $("#contrast-effect").click ->
    $("#preview-window").attr "src", "http://res.cloudinary.com/cerber/image/upload/e_contrast:100/" + $("#preview-window").attr("name") + ".jpg"
    return

  $("#blur-effect").click ->
    $("#preview-window").attr "src", "http://res.cloudinary.com/cerber/image/upload/e_blur/" + $("#preview-window").attr("name") + ".jpg"
    return

  $("#negate-effect").click ->
    $("#preview-window").attr "src", "http://res.cloudinary.com/cerber/image/upload/e_negate/" + $("#preview-window").attr("name") + ".jpg"
    return

  speed = 1000
  $("#render").click ->
    carousel = ->
      return  unless play
      $("#track").delay(speed).animate
        right: "+=" + width
      , 3000, ->
        first = $("#track img:first-child")
        first.remove()
        $(this).append first
        $(this).css right: "-=" + width
        carousel()
        return

      return
    timelineList = $("#timeline-list > li").toArray()
    arraySrcImages = new Array()
    i = 0

    while i < timelineList.length
      arraySrcImages[i] = $(timelineList[i]).children("img").attr("src")
      i++
    track = $("#track")
    i = 0

    while i < arraySrcImages.length
      track.append "<img src=\"" + arraySrcImages[i] + "\" />"
      i++
    arrayImages = $("#track img")
    timelineWidth = 0
    i = 0

    while i < arrayImages.length
      timelineWidth += $(arrayImages[i]).width()
      i++
    $("#track").width timelineWidth
    width = $("#track img").width()
    $("#render-dialog").dialog
      height: 654
      width: 520
      modal: true
      buttons:
        Play: ->
          play = true
          carousel()
          return

        Pause: ->
          play = false
          return

        Close: ->
          play = false
          track.empty()
          $(this).dialog "close"
          return

    play = true
    carousel()
    return

  $("#fileUpload").on "change", ->
    $("#upload").click()
    return

  $("#left-bar").tabs()
  $("#right-bar").tabs()
  $("#apply-speed-slider").click ->
    speed = $("#speed-slider").val()  if $.isNumeric($("#speed-slider").val())
    return

  $("#speed-slider").val speed
  $("#render-dialog").hide()
  $("#url-file-update").click (e) ->
    e.preventDefault()
    url = $("#url-file-link").val()
    $.post "@Url.Action(\"UploadEx\", \"Home\")", "url=" + url.toString(), ->

    return

  $(".right-list-item").click (e) ->
    e.preventDefault()
    url = $(this).attr("src")
    $.get "@Url.Action(\"Manager\", \"Home\")", "url=" + url.toString(), (data) ->
      array = jQuery.parseJSON(data)
      $("#timeline-list").empty()
      i = 0

      while i < array.length
        $("#timeline-list").append "<li><img class=\"left-list-item img-thumbnail\" src=\"" + array[i].PhotoPath + "\" /></li>"
        i++
      return

    return

  return
