(function(){
  var ref$, span, ol, filter, slice, update, parseVtt, sourceFromSelectorOrPath, video, audio, x$;
  ref$ = React.DOM, span = ref$.span, ol = ref$.ol;
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
  this.ReactVTT == null && (this.ReactVTT = React.createClass({
    displayName: 'ReactVTT',
    className: 'react-vtt',
    getDefaultProps: function(){
      return {
        currentTime: function(){
          return 0;
        }
      };
    },
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
      parseVtt(sourceFromSelectorOrPath(this.props.target), function(it){
        this$.state.track = it;
        requestAnimationFrame(update);
      });
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
        }.call(this)))
        : [];
      return ol({
        className: 'react-vtt active-cues'
      }, children);
    }
  }));
  video = $('video').get()[0];
  audio = $('audio').get()[0];
  x$ = React;
  x$.renderComponent(ReactVTT({
    target: 'track#chocolate-rain',
    currentTime: function(){
      return video.currentTime;
    }
  }), $('#video-vtt').get()[0]);
  x$.renderComponent(ReactVTT({
    target: 'track#shared-culture',
    currentTime: function(){
      return audio.currentTime;
    }
  }), $('#audio-vtt').get()[0]);
}).call(this);
