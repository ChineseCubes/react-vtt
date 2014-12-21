(function(){
  var React, $, ReactVTT, Karaoke, AudioTrack, IsolatedCue, Cue, ref$, div, span, a, parse, video, audio, x$;
  React = require('react');
  $ = require('jquery');
  ReactVTT = require('./ReactVTT');
  Karaoke = React.createFactory(ReactVTT.Karaoke);
  AudioTrack = React.createFactory(ReactVTT.AudioTrack);
  IsolatedCue = React.createFactory(ReactVTT.IsolatedCue);
  Cue = React.createFactory(require('./Cue'));
  ref$ = React.DOM, div = ref$.div, span = ref$.span, a = ref$.a;
  parse = ReactVTT.parse;
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
  x$.render(Cue({
    startTime: 1.0,
    endTime: 2.0,
    time: 1.45
  }, div({
    className: 'complex'
  }, span({}, 'This is a '), a({
    className: 'big',
    href: '#'
  }, 'BIG'), span({}, ' cue.'))), $('#video-vtt3').get()[0]);
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
