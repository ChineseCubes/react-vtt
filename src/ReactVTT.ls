$      = require 'jquery'
_      = require 'lodash'
WebVTT = require 'vtt.js'

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

from-selector-or-path = (target) ->
  try
    $track = $ target
  catch e
    return target
  $track.attr \src

ReactVTT =
  parse: parse
  from-selector-or-path: from-selector-or-path
  Cue: require './Cue'

module.exports = ReactVTT

