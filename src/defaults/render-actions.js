import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from './button'
import { RetakeButton, SaveButton } from './ActionButtons'
import Timer from './timer'
import Countdown from './countdown'

const ActionsWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 80px;
`

class Actions extends PureComponent {
  state = {
    elapsedSeconds: 0
  }

  handleTick = state => {
    this.setState(state)
  }

  renderContent () {
    const {
      isVideoInputSupported,
      isInlineRecordingSupported,
      thereWasAnError,
      isRecording,
      isCameraOn,
      streamIsReady,
      isConnecting,
      isRunningCountdown,
      isReplayingVideo,
      countdownTime,
      timeLimit,
      useVideoInput,

      onTurnOnCamera,
      onOpenVideoInput,
      onStartRecording,
      onStopRecording,
      onStopReplaying,
      onConfirm,
      PrimaryButtonComponent
    } = this.props

    const shouldUseVideoInput =
      !isInlineRecordingSupported && isVideoInputSupported

    if (
      (!isInlineRecordingSupported && !isVideoInputSupported) ||
      thereWasAnError ||
      isConnecting ||
      isRunningCountdown
    ) {
      return null
    }

    if (isReplayingVideo) {
      return (
        <>
          <RetakeButton onClick={onStopReplaying} data-qa='start-replaying' />
          {/* TODO: figure out how to trigger the "done" */}
          <SaveButton onClick={onConfirm} />
        </>
      )
    }

    const { elapsedSeconds } = this.state
    const maxSeconds = Math.floor(timeLimit / 1000)
    const maxReadySeconds = Math.floor(countdownTime / 1000)

    if (isRecording || (isCameraOn && streamIsReady)) {
      return (
        <PrimaryButtonComponent
          onClick={isRecording ? onStopRecording : onStartRecording}
          maxSeconds={maxSeconds}
          status={isRecording ? 'recording' : ''}
          data-qa={isRecording ? 'stop-recording' : 'start-recording'}
          elapsedSeconds={elapsedSeconds}
          readySeconds={0}
          maxReadySeconds={maxReadySeconds}
        />
      )
    }

    if (useVideoInput) {
      return (
        <Button onClick={onOpenVideoInput} data-qa='open-input'>
          Upload a video
        </Button>
      )
    }

    return shouldUseVideoInput ? (
      <Button onClick={onOpenVideoInput} data-qa='open-input'>
        Record a video
      </Button>
    ) : (
      <Button onClick={onTurnOnCamera} data-qa='turn-on-camera'>
        Turn my camera ON
      </Button>
    )
  }

  render () {
    const {
      isRecording,
      isRunningCountdown,
      countdownTime,
      timeLimit
    } = this.props

    return (
      <>
        {isRecording && (
          <Timer onTick={this.handleTick} timeLimit={timeLimit} />
        )}
        {isRunningCountdown && <Countdown countdownTime={countdownTime} />}
        <ActionsWrapper>{this.renderContent()}</ActionsWrapper>
      </>
    )
  }
}

Actions.propTypes = {
  isVideoInputSupported: PropTypes.bool,
  isInlineRecordingSupported: PropTypes.bool,
  thereWasAnError: PropTypes.bool,
  isRecording: PropTypes.bool,
  isCameraOn: PropTypes.bool,
  streamIsReady: PropTypes.bool,
  isConnecting: PropTypes.bool,
  isRunningCountdown: PropTypes.bool,
  countdownTime: PropTypes.number,
  timeLimit: PropTypes.number,
  isReplayingVideo: PropTypes.bool,
  useVideoInput: PropTypes.bool,

  onTurnOnCamera: PropTypes.func,
  onOpenVideoInput: PropTypes.func,
  onStartRecording: PropTypes.func,
  onStopRecording: PropTypes.func,
  onStopReplaying: PropTypes.func,
  onConfirm: PropTypes.func,

  PrimaryButtonComponent: PropTypes.elementType
}

export default Actions
