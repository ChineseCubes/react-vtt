React    = require 'react'
ReactDOM = require 'react-dom'
ReactVTT = require './ReactVTT'
Cue      = React.createFactory require './Cue'

{ parse, separate, from-selector-or-path } = ReactVTT

video = document.getElementsByTagName \video .0
audio = document.getElementsByTagName \audio .0

class VideoTrack extends React.Component
  render: ->
    React.createElement do
      \div
      className: 'video-track'
      for i, data of @props.data
        { startTime, endTime, text } = data
        Cue do
          { key: i, startTime, currentTime: @props.currentTime, endTime }
          text
VideoTrack.defaultProps =
  data: []
  currentTime: 0
VideoTrack = React.createFactory VideoTrack

class AudioTrack extends React.Component
  render: ->
    React.createElement do
      \div
      className: 'audio-track'
      for i, data of @props.data.cues
        { startTime, endTime, text } = data
        Cue do
          { key: i, startTime, currentTime: @props.currentTime, endTime }
          text
AudioTrack.defaultProps =
  data:
    cues: []
    active-cues: []
  currentTime: 0
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
  elem0 = document.getElementById 'video-vtt'
  karaoke = ReactDOM.render VideoTrack!, elem0
  update-karaoke = (time, cues) ->
    cue = cues.activeCues.0 or { startTime: 0, endTime: 0 }
    if cues.activeCues.0
      karaoke = ReactDOM.render do
        VideoTrack do
          data: separate cues.activeCues.0
          currentTime: time
        elem0

  # Whole Track
  elem1 = document.getElementById 'audio-vtt'
  audio-track = ReactDOM.render do
    AudioTrack data: audio-cues
    elem1
  update-audio = (time, cues) ->
    ReactDOM.render do
      AudioTrack do
        data: audio-cues
        currentTime: time
      elem1

