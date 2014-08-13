(function(){
  var ref$, p, span, ol, li, filter, slice, update, parseVtt, sourceFromSelectorOrPath, ReactVTTMixin, ReactVTT, video, audio, x$;
  ref$ = React.DOM, p = ref$.p, span = ref$.span, ol = ref$.ol, li = ref$.li;
  filter = _.filter;
  slice = Array.prototype.slice;
  update = function(currentTime){
    var possibleCues;
    possibleCues = slice.call(this.cues);
    return this.activeCues = filter(possibleCues, function(cue){
      return cue.startTime <= currentTime && currentTime < cue.endTime;
    });
  };
  parseVtt = function(src, done){
    var track, x$, parser;
    track = {
      cues: [],
      activeCues: [],
      update: update
    };
    x$ = parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
    x$.oncue = function(it){
      return track.cues.push(it);
    };
    x$.onflush = function(){
      return done(track);
    };
    $.get(src, function(data){
      var x$;
      x$ = parser;
      x$.parse(data);
      x$.flush();
      return x$;
    });
  };
  sourceFromSelectorOrPath = function(target){
    var $track;
    $track = $(target);
    if ($track.length === 0) {
      return target;
    } else {
      return $track.attr('src');
    }
  };
  ReactVTTMixin = {
    getInitialState: function(){
      return {
        track: null
      };
    },
    componentWillMount: function(){
      var update, this$ = this;
      update = function(){
        if (this$.isMounted()) {
          this$.forceUpdate();
        }
        return requestAnimationFrame(update);
      };
      parseVtt(sourceFromSelectorOrPath(this.props.target), function(track){
        this$.state.track = track;
        requestAnimationFrame(update);
      });
    }
  };
  ReactVTT = {
    mixin: ReactVTTMixin,
    Karaoke: React.createClass({
      displayName: 'ReactVTT.Karaoke',
      mixins: [ReactVTTMixin],
      getDefaultProps: function(){
        return {
          currentTime: function(){
            return 0;
          }
        };
      },
      render: function(){
        var children, currentTime;
        children = this.state.track != null
          ? (currentTime = this.props.currentTime(), this.state.track.update(currentTime), (function(){
            var i$, to$, results$ = [];
            for (i$ = 0, to$ = this.state.track.activeCues.length; i$ < to$; ++i$) {
              results$.push((fn$.call(this, i$)));
            }
            return results$;
            function fn$(i){
              var cue, text, delta, ratio;
              cue = this.state.track.activeCues[i];
              text = cue.text.replace(/<.*?>/g, '');
              delta = currentTime - cue.startTime;
              ratio = 100 * delta / (cue.endTime - cue.startTime);
              return li({
                key: i
              }, span({
                className: 'cue'
              }, text, span({
                className: 'actived',
                style: {
                  width: ratio + "%"
                }
              }, text)));
            }
          }.call(this)))
          : [];
        return ol({
          className: 'react-vtt karaoke cues'
        }, children);
      }
    }),
    AudioTrack: React.createClass({
      displayName: 'ReactVTT.AudioTrack',
      mixins: [ReactVTTMixin],
      getDefaultProps: function(){
        return {
          currentTime: function(){
            return 0;
          }
        };
      },
      render: function(){
        var children, currentTime;
        children = this.state.track != null
          ? (currentTime = this.props.currentTime(), (function(){
            var i$, to$, results$ = [];
            for (i$ = 0, to$ = this.state.track.cues.length; i$ < to$; ++i$) {
              results$.push((fn$.call(this, i$)));
            }
            return results$;
            function fn$(i){
              var cue, text, ratio, delta;
              cue = this.state.track.cues[i];
              text = cue.text.replace(/<.*?>/g, '');
              ratio = (function(){
                switch (false) {
                case !(currentTime < cue.startTime):
                  return 0;
                case !(currentTime >= cue.endTime):
                  return 100;
                default:
                  delta = currentTime - cue.startTime;
                  return 100 * delta / (cue.endTime - cue.startTime);
                }
              }());
              return li({
                key: i
              }, span({
                className: 'cue'
              }, text, span({
                className: 'actived',
                style: {
                  width: ratio + "%"
                }
              }, text)));
            }
          }.call(this)))
          : [];
        return ol({
          className: 'react-vtt audio-track cues'
        }, children);
      }
    })
  };
  this.ReactVTT == null && (this.ReactVTT = ReactVTT);
  video = $('video').get()[0];
  audio = $('audio').get()[0];
  x$ = React;
  x$.renderComponent(ReactVTT.Karaoke({
    target: 'track#chocolate-rain',
    currentTime: function(){
      return video.currentTime;
    }
  }), $('#video-vtt').get()[0]);
  x$.renderComponent(ReactVTT.AudioTrack({
    target: 'track#shared-culture',
    currentTime: function(){
      return audio.currentTime;
    }
  }), $('#audio-vtt').get()[0]);
}).call(this);
