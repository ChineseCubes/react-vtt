(function(){
  var $video, video, tracks, startTime, x$;
  console.log('foobar');
  $video = $('video');
  video = $video.get()[0];
  tracks = video.textTracks[0];
  console.log(tracks);
  startTime = 0;
  x$ = $video;
  x$.on('play', function(e){});
  x$.on('timeupdate', function(e){
    if (startTime === 0) {
      startTime = video.currentTime;
    }
    return console.log(video.currentTime - startTime);
  });
}).call(this);
