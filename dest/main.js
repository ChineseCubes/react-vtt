(function(){
  var React, ReactVTT, Cue, ref$, div, span, parse, fromSelectorOrPath, video, audio, AudioTrack;
  React = require('react');
  ReactVTT = require('./ReactVTT');
  Cue = React.createFactory(require('./Cue'));
  ref$ = React.DOM, div = ref$.div, span = ref$.span;
  parse = ReactVTT.parse, fromSelectorOrPath = ReactVTT.fromSelectorOrPath;
  video = document.getElementsByTagName('video')[0];
  audio = document.getElementsByTagName('audio')[0];
  AudioTrack = React.createClass({
    displayName: 'AudioTrack',
    getDefaultProps: function(){
      return {
        data: {
          cues: [],
          activeCues: []
        },
        currentTime: 0
      };
    },
    render: function(){
      var i, data;
      return div({
        className: 'audio-track'
      }, (function(){
        var ref$, results$ = [];
        for (i in ref$ = this.props.data.cues) {
          data = ref$[i];
          results$.push(Cue((data.key = i, data.currentTime = this.props.currentTime, data), data.text));
        }
        return results$;
      }.call(this)));
    }
  });
  AudioTrack = React.createFactory(AudioTrack);
  parse(fromSelectorOrPath('track#chocolate-rain'), function(videoCues){
    return parse(fromSelectorOrPath('track#shared-culture'), function(audioCues){
      var update, karaoke, updateKaraoke, audioTrack, updateAudio;
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
      karaoke = React.render(Cue(), document.getElementById('video-vtt'));
      updateKaraoke = function(time, cues){
        var cue;
        cue = cues.activeCues[0] || {
          startTime: 0,
          endTime: 0
        };
        return karaoke.setProps((cue.currentTime = time, cue.children = span({}, cue.text), cue));
      };
      audioTrack = React.render(AudioTrack({
        data: audioCues
      }), document.getElementById('audio-vtt'));
      return updateAudio = function(time, cues){
        return audioTrack.setProps({
          currentTime: time
        });
      };
    });
  });
}).call(this);
