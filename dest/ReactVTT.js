(function(){
  var $, _, WebVTT, filter, update, parse, separate, fromSelectorOrPath, ReactVTT;
  $ = require('jquery');
  _ = require('lodash');
  WebVTT = require('vtt.js');
  filter = _.filter;
  update = function(currentTime){
    var possibleCues;
    possibleCues = Array.prototype.slice.call(this.cues);
    return this.activeCues = filter(possibleCues, function(cue){
      return cue.startTime <= currentTime && currentTime < cue.endTime;
    });
  };
  parse = function(src, done){
    var track, parser, x$;
    track = {
      cues: [],
      activeCues: [],
      update: update
    };
    parser = (function(){
      try {
        return new WebVTT.Parser(window, WebVTT.StringDecoder());
      } catch (e$) {}
    }());
    if (parser) {
      x$ = parser;
      x$.oncue = function(it){
        return track.cues.push(it);
      };
      x$.onflush = function(){
        return done(track);
      };
      if (/.json$/.exec(src)) {
        return $.getJSON(src, function(arg$){
          var data, x$;
          data = arg$.webvtt;
          x$ = parser;
          x$.parse(data);
          x$.flush();
          return x$;
        });
      }
      $.get(src, function(data){
        var x$;
        x$ = parser;
        x$.parse(data);
        x$.flush();
        return x$;
      });
    } else {
      done(null);
    }
  };
  separate = function(cue){
    var re, lastTime, lastIndex, parts, res$, r, text, hr, min, sec, ms, time, part;
    re = /(.*?)<(\d\d):(\d\d):(\d\d).(\d\d\d)>/g;
    lastTime = cue.startTime;
    lastIndex = 0;
    res$ = [];
    while (r = re.exec(cue.text)) {
      text = r[1], hr = r[2], min = r[3], sec = r[4], ms = r[5];
      time = (+hr) * 3600 + (+min) * 60 + (+sec) + (+ms) / 1000;
      part = {
        text: text,
        startTime: lastTime,
        endTime: time
      };
      lastTime = time;
      lastIndex = re.lastIndex;
      res$.push(part);
    }
    parts = res$;
    if (lastIndex !== cue.text.length) {
      parts.push({
        text: cue.text.slice(lastIndex),
        startTime: lastTime,
        endTime: cue.endTime
      });
    }
    return parts;
  };
  fromSelectorOrPath = function(target){
    var $track, e;
    try {
      $track = $(target);
    } catch (e$) {
      e = e$;
      return target;
    }
    return $track.attr('src');
  };
  ReactVTT = {
    parse: parse,
    separate: separate,
    fromSelectorOrPath: fromSelectorOrPath,
    Cue: require('./Cue')
  };
  module.exports = ReactVTT;
}).call(this);
