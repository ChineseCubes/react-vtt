video  = $ \video .get!0
video2 = $ \video .get!1
audio  = $ \audio .get!0
# the resolution of e.timeStamp in FireFox is 100x than other
# browsers and the event fires more frequently, so we should use
# video.currentTime instead of e.timeStamp
React
  ..renderComponent do
    ReactVTT.Karaoke do
      target: 'track#chocolate-rain'
      current-time: -> video.current-time
    $ \#video-vtt .get!0
  ..renderComponent do
    ReactVTT.AudioTrack do
      target: 'track#shared-culture'
      current-time: -> audio.current-time
    $ \#audio-vtt .get!0
# $ '#video-vtt2 > .cue' .each (i) ->
# React.renderComponent do
#   ReactVTT.IsolatedCue do
#     target: './assets/chocolate_rain.vtt'
#     id: i + 1
#     current-time: -> video2.current-time
#     this

