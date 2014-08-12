console.log \foobar

# vtt.js
#vtt-source = $ 'video > track' .attr \src
#data <- $.get vtt-source
#string-decoder = WebVTT.StringDecoder!
#parser = new WebVTT.Parser window, string-decoder
#  ..onregion = (region) ->
#    console.log region
#  ..oncue    = (cue) ->
#    console.log cue.startTime, cue.endTime
#  ..parse data

# pure video events
$video = $ \video
video = $video.get!0
tracks = video.text-tracks.0
console.log tracks

start-time = 0
$video
  ..on \play (e) ->
  ..on \timeupdate (e) ->
    # the resolution of e.timeStamp in FireFox is 100x than other
    # browsers and the event fires more frequently, so we should use
    # video.currentTime instead of e.timeStamp
    start-time := video.current-time if start-time is 0
    console.log video.current-time - start-time

