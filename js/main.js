(function(){
  var video, video2, audio, x$;
  video = $('video').get()[0];
  video2 = $('video').get()[1];
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
