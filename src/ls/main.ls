{span, ol} = React.DOM

this.ReactVTT ?=
  React.createClass do
    displayName: 'ReactVTT'
    className: 'react-vtt'
    getInitialState: ->
      attributes: {}
      media: null
      track: null
    componentWillMount: !->
      # find track in tracks
      $track = $ @props.target
      track = $track.get!0
      if not track
        throw new Error "Target <track>: #{@props.target} not found"
      @state.media = $track.closest \video .get!0
      @state.media = $track.closest \audio .get!0    if not @state.media
      throw new Error '<video> or <audio> not found' if not @state.media
      tracks = @state.media.text-tracks
      for attr in track.attributes
        value = if attr.value isnt '' then attr.value else true
        @state.attributes[attr.name] = value
      for track in tracks
        if track.kind     is @state.attributes.kind  and
           track.label    is @state.attributes.label and
           track.language is @state.attributes.srclang
          @state.track = track
          break
      if not @state.track
        throw new Error "Target TextTrack not found"
      # for better animation, requestAnimationFrame
      # is better than timeupdate event
      #$media.on \timeupdate (e) ~> @forceUpdate! if @isMounted!
      update = ~>
        @forceUpdate! if @isMounted!
        requestAnimationFrame update
      requestAnimationFrame update
    render: ->
      children = if @state.track.active-cues
        for let i from 0 til @state.track.active-cues.length
          cue = @state.track.active-cues[i]
          # FIXME: should deal with cue payload text tags
          text = cue.text.replace /<.*?>/g, ''
          # the resolution of e.timeStamp in FireFox is 100x than other
          # browsers and the event fires more frequently, so we should use
          # video.currentTime instead of e.timeStamp
          delta = @state.media.current-time - cue.start-time
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

React
  ..renderComponent do
    ReactVTT target: 'track#chocolate-rain'
    $ \#video-vtt .get!0
  ..renderComponent do
    ReactVTT target: 'track#shared-culture'
    $ \#audio-vtt .get!0
