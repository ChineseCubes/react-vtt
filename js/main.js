(function(){
  var video, audio, x$;
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
