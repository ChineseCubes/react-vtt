$          = require 'jquery'
_          = require 'lodash'
{ WebVTT } = require 'vtt.js'

{ filter } = _

update = (current-time) ->
  possible-cues = Array::slice.call @cues
  @active-cues = filter possible-cues, (cue) ->
    cue.start-time <= current-time < cue.end-time

parse = !(src, done) ->
  track =
    cues: []
    active-cues: []
    update: update
  parser = try new WebVTT.Parser window, WebVTT.StringDecoder!
  if parser
    parser
      ..oncue   = -> track.cues.push it
      ..onflush = -> done track
    if src is /.json$/
      return $.getJSON src, ({webvtt: data}) ->
        parser
          ..parse data
          ..flush!
    $.get src, (data) ->
      parser
        ..parse data
        ..flush!
  else
    done null

separate = (cue) ->
  re = /(.*?)<(\d\d):(\d\d):(\d\d).(\d\d\d)>/g
  lastTime = cue.startTime
  lastIndex = 0
  parts = while r = re.exec cue.text
    { 1: text, 2: hr, 3: min, 4: sec, 5: ms } = r
    time = (+hr) * 3600 + (+min) * 60 + (+sec) + (+ms) / 1000
    part =
      text: text
      startTime: lastTime
      endTime: time
    lastTime = time
    lastIndex = re.lastIndex
    part
  if lastIndex isnt cue.text.length
    parts.push do
      text: cue.text.slice lastIndex
      startTime: lastTime
      endTime: cue.endTime
  parts

from-selector-or-path = (target) ->
  try
    $track = $ target
  catch e
    return target
  $track.attr \src

ReactVTT =
  parse: parse
  separate: separate
  from-selector-or-path: from-selector-or-path
  Cue: require './Cue'

module.exports = ReactVTT

