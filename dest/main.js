(function(){
  var React, $, ReactVTT, video, audio, x$;
  React = require('react');
  $ = require('jquery');
  ReactVTT = require('./react-vtt');
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
  $('#video-vtt2 .cue').each(function(i){
    var e;
    try {
      return React.renderComponent(ReactVTT.IsolatedCue({
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
