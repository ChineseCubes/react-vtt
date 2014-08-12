(function(){
  var ref$, span, ol;
  ref$ = React.DOM, span = ref$.span, ol = ref$.ol;
  this.ReactVTT == null && (this.ReactVTT = React.createClass({
    displayName: 'ReactVTT',
    className: 'react-vtt',
    getInitialState: function(){
      return {
        attributes: {},
        media: null,
        track: null
      };
    },
    componentWillMount: function(){
      var $media, $track, track, tracks, i$, ref$, len$, attr, value, update, this$ = this;
      $media = $('video');
      if ($media.length === 0) {
        $media = $('audio');
      }
      this.state.media = $media.get()[0];
      if (!this.state.media) {
        throw new Error('<video> or <audio> not found');
      }
      $track = $media.children(this.props.target);
      track = $track.get()[0];
      if (!track) {
        throw new Error("Target <track>: " + this.props.target + " not found");
      }
      tracks = this.state.media.textTracks;
      for (i$ = 0, len$ = (ref$ = track.attributes).length; i$ < len$; ++i$) {
        attr = ref$[i$];
        value = attr.value !== '' ? attr.value : true;
        this.state.attributes[attr.name] = value;
      }
      for (i$ = 0, len$ = tracks.length; i$ < len$; ++i$) {
        track = tracks[i$];
        if (track.kind === this.state.attributes.kind && track.label === this.state.attributes.label && track.language === this.state.attributes.srclang) {
          this.state.track = track;
          break;
        }
      }
      if (!this.state.track) {
        throw new Error("Target TextTrack not found");
      }
      update = function(){
        if (this$.isMounted()) {
          this$.forceUpdate();
        }
        return requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    },
    render: function(){
      var children;
      children = this.state.track.activeCues
        ? (function(){
          var i$, to$, results$ = [];
          for (i$ = 0, to$ = this.state.track.activeCues.length; i$ < to$; ++i$) {
            results$.push((fn$.call(this, i$)));
          }
          return results$;
          function fn$(i){
            var cue, text, delta, ratio;
            cue = this.state.track.activeCues[i];
            text = cue.text.replace(/<.*?>/g, '');
            delta = this.state.media.currentTime - cue.startTime;
            ratio = 100 * delta / (cue.endTime - cue.startTime);
            return span({
              key: i,
              className: 'cue'
            }, text, span({
              className: 'actived',
              style: {
                width: ratio + "%"
              }
            }, text));
          }
        }.call(this))
        : [];
      return ol({
        className: 'react-vtt active-cues'
      }, children);
    }
  }));
  React.renderComponent(ReactVTT({
    target: 'track'
  }), $('#react-vtt').get()[0]);
}).call(this);
