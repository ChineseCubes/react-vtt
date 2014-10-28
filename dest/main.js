(function(){
  var React, $, ReactVTT, Karaoke, AudioTrack, IsolatedCue, video, audio, x$;
  React = require('react');
  $ = require('jquery');
  ReactVTT = require('./ReactVTT');
  Karaoke = React.createFactory(ReactVTT.Karaoke);
  AudioTrack = React.createFactory(ReactVTT.AudioTrack);
  IsolatedCue = React.createFactory(ReactVTT.IsolatedCue);
  video = $('video').get()[0];
  audio = $('audio').get()[0];
  x$ = React;
  x$.render(Karaoke({
    target: 'track#chocolate-rain',
    currentTime: function(){
      return video.currentTime;
    }
  }), $('#video-vtt').get()[0]);
  x$.render(AudioTrack({
    target: 'track#shared-culture',
    currentTime: function(){
      return audio.currentTime;
    }
  }), $('#audio-vtt').get()[0]);
  $('#video-vtt2 .cue').each(function(i){
    var e;
    try {
      return React.render(IsolatedCue({
        target: './assets/chocolate_rain.vtt',
        index: i,
        match: $(this).text(),
        currentTime: function(){
          return video.currentTime;
        }
      }), this);
    } catch (e$) {
      e = e$;
      return console.log(e, this);
    }
  });
}).call(this);
