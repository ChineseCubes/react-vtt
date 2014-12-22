React    = require 'react'
ReactVTT = require './ReactVTT'
Cue      = React.createFactory require './Cue'

{ div, span } = React.DOM
{ parse, from-selector-or-path } = ReactVTT

video = document.getElementsByTagName \video .0
audio = document.getElementsByTagName \audio .0

AudioTrack = React.createClass do
  displayName: 'AudioTrack'
  getDefaultProps: ->
    data:
      cues: []
      active-cues: []
    currentTime: 0
  render: ->
    div do
      className: 'audio-track'
      for i, data of @props.data.cues
        Cue do
          data <<< { key: i, currentTime: @props.currentTime }
          data.text
AudioTrack = React.createFactory AudioTrack

do
  video-cues <- parse from-selector-or-path 'track#chocolate-rain'
  audio-cues <- parse from-selector-or-path 'track#shared-culture'
  update = ->
    # the resolution of e.timeStamp in FireFox is 100x than other
    # browsers and the event fires more frequently, so we should use
    # video.currentTime instead of e.timeStamp
    video-time = video.currentTime
    video-cues.update video-time
    update-karaoke video-time, video-cues
    audio-time = audio.currentTime
    audio-cues.update audio-time
    update-audio   audio-time, audio-cues
    requestAnimationFrame update
  requestAnimationFrame update

  # Karaoke
  karaoke = React.render Cue!, document.getElementById 'video-vtt'
  update-karaoke = (time, cues) ->
    cue = cues.activeCues.0 or { startTime: 0, endTime: 0 }
    karaoke.setProps do
      cue <<< { currentTime: time, children: span {} cue.text }

  # Whole Track
  audio-track = React.render do
    AudioTrack data: audio-cues
    document.getElementById 'audio-vtt'
  update-audio = (time, cues) ->
    audio-track.setProps currentTime: time

