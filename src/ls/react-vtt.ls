{p, span, ol, li} = React.DOM
{filter} = _

slice = Array.prototype.slice

update = (current-time) ->
  possible-cues = slice.call @cues
  @active-cues = filter possible-cues, (cue) ->
    cue.start-time <= current-time < cue.end-time

parse-vtt = !(src, done) ->
  track =
    cues: []
    active-cues: []
    update: update
  parser = new WebVTT.Parser window, WebVTT.StringDecoder!
    ..oncue   = -> track.cues.push it
    ..onflush = -> done track
  $.get src, (data) ->
    parser
      ..parse data
      ..flush!

source-from-selector-or-path = (target) ->
  try
    $track = $ target
  catch e
    return target
  $track.attr \src

ReactVTTMixin =
  getDefaultProps: ->
    current-time: -> 0
  getInitialState: ->
    track: null
  componentWillMount: !->
    # for better animation, requestAnimationFrame
    # is better than timeupdate event
    #$media.on \timeupdate (e) ~> @forceUpdate! if @isMounted!
    update = ~>
      @forceUpdate! if @isMounted!
      requestAnimationFrame update
    parse-vtt do
      source-from-selector-or-path @props.target
      !(@state.track) ~> requestAnimationFrame update
  render: ->
    children = if @state.track?
      current-time = @props.current-time!
      @state.track.update current-time
      for let i, cue of @cuesToDisplay!
        # FIXME: should deal with cue payload text tags
        text = cue.text.replace /<.*?>/g, ''
        ratio = switch
        | current-time <  cue.start-time => 0
        | current-time >= cue.end-time   => 100
        | otherwise
          delta = current-time - cue.start-time
          100 * delta / (cue.end-time - cue.start-time)
        li do
          key: i
          span do
            className: 'cue'
            text
            span do
              className: 'actived'
              style:
                width: "#ratio%"
              text
    else []
    ol do
      className: "react-vtt cues #{@props.className}"
      children

ReactVTT =
  mixin: ReactVTTMixin
  Karaoke: React.createClass do
    displayName: 'ReactVTT.Karaoke'
    mixins: [ReactVTTMixin]
    getDefaultProps: ->
      className: 'karaoke'
    cuesToDisplay: -> @state.track.active-cues
  AudioTrack: React.createClass do
    displayName: 'ReactVTT.AudioTrack'
    mixins: [ReactVTTMixin]
    getDefaultProps: ->
      className: 'audio-track'
    cuesToDisplay: -> @state.track.cues
  # need a better name
  IsolatedCue: React.createClass do
    displayName: 'ReactVTT.IsolatedCue'
    mixins: [ReactVTTMixin]
    getDefaultProps: ->
      className: 'isolated-cue'
      index: 0
      match: null
    cuesToDisplay: ->
      | not @props.match => [@state.track.cues[@props.index]]
      | otherwise
        cue = null
        for i from @props.index til @state.track.cues.length
          cue := @state.track.cues[i]
          text = cue.text.replace /<.*?>/g, ''
          break if text is @props.match
        [cue]

this.ReactVTT ?= ReactVTT

