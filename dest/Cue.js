(function(){
  var React, Cue;
  React = require('react');
  Cue = (function(superclass){
    var prototype = extend$((import$(Cue, superclass).displayName = 'Cue', Cue), superclass).prototype, constructor = Cue;
    prototype.render = function(){
      var duration, progress;
      duration = this.props.endTime - this.props.startTime;
      progress = duration === 0
        ? 0
        : (this.props.currentTime - this.props.startTime) / duration * 100;
      if (progress < 0) {
        progress = 0;
      }
      if (progress > 100) {
        progress = 100;
      }
      return React.createElement('div', {
        className: 'cue'
      }, React.createElement('div', {
        className: 'children'
      }, this.props.children, React.createElement('div', {
        className: 'overlay',
        style: {
          width: progress + "%"
        }
      }, this.props.children)));
    };
    function Cue(){
      Cue.superclass.apply(this, arguments);
    }
    return Cue;
  }(React.Component));
  Cue.defaultProps = {
    startTime: 0,
    endTime: 0,
    currentTime: 0
  };
  module.exports = Cue;
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
