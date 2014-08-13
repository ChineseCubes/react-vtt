# react-vtt

A React component for displaying WebVTT tracks.

## Install

```bash
bower install react-vtt
```

## Usage

There are two different views in `ReactVTT`.

* `ReactVTT.Karaoke` displays current actived cues only.
* `ReactVTT.AudioTrack` displays every cues and highlight actived cues.

Like the following example, you can use this component with or without <track>, and you can decide how to update the currentTime.

```JavaScript
  audio = document.getElementByTagName('audio')[0]

  React.renderComponent(
    ReactVTT.Karaoke({
      target: 'track#chocolate-rain',
      // or just the path
      //traget: './assets/chocolate_rain.vtt'
      currentTime: function(){ return audio.currentTime; }
    }),
    document.getElementById('#audio-vtt')
  );
```

