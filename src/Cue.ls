React = require 'react'

class Cue extends React.Component
  render: ->
    duration = @props.endTime - @props.startTime
    progress = if duration is 0 then 0 else
      (@props.currentTime - @props.startTime) / duration * 100
    if progress < 0   then progress = 0
    if progress > 100 then progress = 100
    React.createElement do
      \div
      className: 'cue'
      React.createElement do
        \div
        className: 'children'
        @props.children
        React.createElement do
          \div
          className: 'overlay'
          style:
            width: "#progress%"
          @props.children
Cue.defaultProps =
  startTime: 0
  endTime: 0
  currentTime: 0

module.exports = Cue
