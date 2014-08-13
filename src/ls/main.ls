{span, ol} = React.DOM
{filter}   = _

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
  $track = $ target
  if $track.length is 0 then target else $track.attr \src

ReactVTTMixin =
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

ReactVTT =
  mixin: ReactVTTMixin
  Karaoke: React.createClass do
    displayName: 'ReactVTT'
    className: 'react-vtt'
    mixins: [ReactVTTMixin]
    getDefaultProps: ->
      current-time: -> 0
    render: ->
      children = if @state.track?
        current-time = @props.current-time!
        @state.track.update current-time
        for let i from 0 til @state.track.active-cues.length
          cue = @state.track.active-cues[i]
          # FIXME: should deal with cue payload text tags
          text = cue.text.replace /<.*?>/g, ''
          delta = current-time - cue.start-time
          ratio = 100 * delta / (cue.end-time - cue.start-time)
          span do
            key: i
            className: 'cue'
            text
            span do
              className: 'actived'
              style:
                width: "#ratio%"
              text
      else []
      ol do
        className: 'react-vtt active-cues'
        children
this.ReactVTT ?= ReactVTT

video = $ \video .get!0
audio = $ \audio .get!0
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
    ReactVTT.Karaoke do
      target: 'track#shared-culture'
      current-time: -> audio.current-time
    $ \#audio-vtt .get!0
