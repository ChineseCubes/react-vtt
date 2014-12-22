React = require 'react'

{ div } = React.DOM

Cue = React.createClass do
  displayName: 'ReactVTT.Cue'
  getDefaultProps: ->
    startTime: 0
    endTime: 0
    currentTime: 0
  render: ->
    duration = @props.endTime - @props.startTime
    progress = if duration is 0 then 0 else
      (@props.currentTime - @props.startTime) / duration * 100
    if progress < 0   then progress = 0
    if progress > 100 then progress = 100
    div do
      className: 'cue'
      div do
        className: 'children'
        @props.children
        div do
          className: 'overlay'
          style:
            width: "#progress%"
          @props.children

module.exports = Cue
