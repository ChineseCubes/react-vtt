(function(){
  var React, div, Cue;
  React = require('react');
  div = React.DOM.div;
  Cue = React.createClass({
    displayName: 'ReactVTT.Cue',
    getDefaultProps: function(){
      return {
        startTime: 0,
        endTime: 0,
        currentTime: 0
      };
    },
    render: function(){
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
      return div({
        className: 'cue'
      }, div({
        className: 'children'
      }, this.props.children, div({
        className: 'overlay',
        style: {
          width: progress + "%"
        }
      }, this.props.children)));
    }
  });
  module.exports = Cue;
}).call(this);
