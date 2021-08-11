import React from 'react'
import ReactPlayer from 'react-player'

export default function VideoImage(props) {
  return (
      <ReactPlayer className="video-content" url={props.src} controls={true} width={"100%"}  height={"auto"}/>
  )
}
