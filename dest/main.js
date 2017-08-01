(function(){
  var React, ReactDOM, ReactVTT, Cue, parse, separate, fromSelectorOrPath, video, audio, VideoTrack, AudioTrack;
  React = require('react');
  ReactDOM = require('react-dom');
  ReactVTT = require('./ReactVTT');
  Cue = React.createFactory(require('./Cue'));
  parse = ReactVTT.parse, separate = ReactVTT.separate, fromSelectorOrPath = ReactVTT.fromSelectorOrPath;
  video = document.getElementsByTagName('video')[0];
  audio = document.getElementsByTagName('audio')[0];
  VideoTrack = (function(superclass){
    var prototype = extend$((import$(VideoTrack, superclass).displayName = 'VideoTrack', VideoTrack), superclass).prototype, constructor = VideoTrack;
    prototype.render = function(){
      var i, data, startTime, endTime, text;
      return React.createElement('div', {
        className: 'video-track'
      }, (function(){
        var ref$, results$ = [];
        for (i in ref$ = this.props.data) {
          data = ref$[i];
          startTime = data.startTime, endTime = data.endTime, text = data.text;
          results$.push(Cue({
            key: i,
            startTime: startTime,
            currentTime: this.props.currentTime,
            endTime: endTime
          }, text));
        }
        return results$;
      }.call(this)));
    };
    function VideoTrack(){
      VideoTrack.superclass.apply(this, arguments);
    }
    return VideoTrack;
  }(React.Component));
  VideoTrack.defaultProps = {
    data: [],
    currentTime: 0
  };
  VideoTrack = React.createFactory(VideoTrack);
  AudioTrack = (function(superclass){
    var prototype = extend$((import$(AudioTrack, superclass).displayName = 'AudioTrack', AudioTrack), superclass).prototype, constructor = AudioTrack;
    prototype.render = function(){
      var i, data, startTime, endTime, text;
      return React.createElement('div', {
        className: 'audio-track'
      }, (function(){
        var ref$, results$ = [];
        for (i in ref$ = this.props.data.cues) {
          data = ref$[i];
          startTime = data.startTime, endTime = data.endTime, text = data.text;
          results$.push(Cue({
            key: i,
            startTime: startTime,
            currentTime: this.props.currentTime,
            endTime: endTime
          }, text));
        }
        return results$;
      }.call(this)));
    };
    function AudioTrack(){
      AudioTrack.superclass.apply(this, arguments);
    }
    return AudioTrack;
  }(React.Component));
  AudioTrack.defaultProps = {
    data: {
      cues: [],
      activeCues: []
    },
    currentTime: 0
  };
  AudioTrack = React.createFactory(AudioTrack);
  parse(fromSelectorOrPath('track#chocolate-rain'), function(videoCues){
    return parse(fromSelectorOrPath('track#shared-culture'), function(audioCues){
      var update, elem0, karaoke, updateKaraoke, elem1, audioTrack, updateAudio;
      update = function(){
        var videoTime, audioTime;
        videoTime = video.currentTime;
        videoCues.update(videoTime);
        updateKaraoke(videoTime, videoCues);
        audioTime = audio.currentTime;
        audioCues.update(audioTime);
        updateAudio(audioTime, audioCues);
        return requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      elem0 = document.getElementById('video-vtt');
      karaoke = ReactDOM.render(VideoTrack(), elem0);
      updateKaraoke = function(time, cues){
        var cue, karaoke;
        cue = cues.activeCues[0] || {
          startTime: 0,
          endTime: 0
        };
        if (cues.activeCues[0]) {
          return karaoke = ReactDOM.render(VideoTrack({
            data: separate(cues.activeCues[0]),
            currentTime: time
          }), elem0);
        }
      };
      elem1 = document.getElementById('audio-vtt');
      audioTrack = ReactDOM.render(AudioTrack({
        data: audioCues
      }), elem1);
      return updateAudio = function(time, cues){
        return ReactDOM.render(AudioTrack({
          data: audioCues,
          currentTime: time
        }), elem1);
      };
    });
  });
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
