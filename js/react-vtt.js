(function(){
  var ref$, p, span, ol, li, filter, slice, update, parseVtt, sourceFromSelectorOrPath, ReactVTTMixin, ReactVTT;
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
    var $track, e;
    try {
      $track = $(target);
    } catch (e$) {
      e = e$;
      return target;
    }
    return $track.attr('src');
  };
  ReactVTTMixin = {
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
        var currentTime;
        currentTime = this$.props.currentTime();
        if (this$.isMounted() && currentTime !== this$.state.currentTime) {
          this$.state.currentTime = currentTime;
          this$.forceUpdate();
        }
        return setTimeout(update, 50);
      };
      parseVtt(sourceFromSelectorOrPath(this.props.target), function(track){
        this$.state.track = track;
        requestAnimationFrame(update);
      });
    },
    render: function(){
      var children, currentTime, ref$;
      children = this.state.track != null
        ? (currentTime = (ref$ = this.state).currentTime || (ref$.currentTime = this.props.currentTime()), this.state.track.update(currentTime), (function(){
          var i$, results$ = [];
          for (i$ in this.cuesToDisplay()) {
            results$.push((fn$.call(this, i$, this.cuesToDisplay()[i$])));
          }
          return results$;
          function fn$(i, cue){
            var text, ratio, delta;
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
        className: "react-vtt cues " + this.props.className
      }, children);
    }
  };
  ReactVTT = {
    parse: parseVtt,
    mixin: ReactVTTMixin,
    Karaoke: React.createClass({
      displayName: 'ReactVTT.Karaoke',
      mixins: [ReactVTTMixin],
      getDefaultProps: function(){
        return {
          className: 'karaoke'
        };
      },
      cuesToDisplay: function(){
        return this.state.track.activeCues;
      }
    }),
    AudioTrack: React.createClass({
      displayName: 'ReactVTT.AudioTrack',
      mixins: [ReactVTTMixin],
      getDefaultProps: function(){
        return {
          className: 'audio-track'
        };
      },
      cuesToDisplay: function(){
        return this.state.track.cues;
      }
    }),
    IsolatedCue: React.createClass({
      displayName: 'ReactVTT.IsolatedCue',
      mixins: [ReactVTTMixin],
      getDefaultProps: function(){
        return {
          className: 'isolated-cue',
          index: 0,
          match: null
        };
      },
      cuesToDisplay: function(){
        var cue, i$, to$, i, text;
        switch (false) {
        case !!this.props.match:
          return [this.state.track.cues[this.props.index]];
        default:
          cue = null;
          for (i$ = this.props.index, to$ = this.state.track.cues.length; i$ < to$; ++i$) {
            i = i$;
            cue = this.state.track.cues[i];
            text = cue.text.replace(/<.*?>/g, '');
            if (text === this.props.match) {
              break;
            }
          }
          return [cue];
        }
      }
    })
  };
  this.ReactVTT == null && (this.ReactVTT = ReactVTT);
}).call(this);
