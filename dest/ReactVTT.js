(function(){
  var $, _, WebVTT, filter, update, parse, fromSelectorOrPath, ReactVTT;
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
    fromSelectorOrPath: fromSelectorOrPath,
    Cue: require('./Cue')
  };
  module.exports = ReactVTT;
}).call(this);
