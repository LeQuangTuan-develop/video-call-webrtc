import React, { Component } from 'react';
import './App.css'
import io from 'socket.io-client'
import {pc_config} from './config/webrtc-config'

class App extends Component {
  constructor(props) {
    super(props)

    // https://reactjs.org/docs/refs-and-the-dom.html
    this.localVideoref = React.createRef()
    this.remoteVideoref = React.createRef()

    this.state = {
      isCall: false,
      isClickedAnswer: false,
      isCallee: false,
      camera: true,
      mic: false
    }

    this.socket = null
    this.pc = null
    this.stream = null
  }

  componentDidMount = () => {

    this.socket = io.connect(
      '/webrtcPeer',
      {
        path: '/io/webrtc',
        query: {}
      }
    )

    this.socket.on('connection-success', success => {
      console.log("Kết nối thành công", success)
    })

    this.socket.on('offerOrAnswer', (sdp) => {
      // this.textref.value = JSON.stringify(sdp)
      
      console.log(sdp.type);
      if (sdp.type === "offer") {
        this.setState({
          ...this.state,
          isCallee: true,
          isCall: true
        })
      } 

      if (sdp.type === "answer") {
        this.setState({
          ...this.state,
          isCaller: true
        })
      }
      console.log("set remote description");
      this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
    })

    this.socket.on('candidate', (candidate) => {
      console.log("add candidate vào máy local");
      this.pc.addIceCandidate(new RTCIceCandidate(candidate))
    })

    this.socket.on('stopCall', (candidate) => {
      console.log("Hủy kết nối");
      this.pc.close()
      this.setState({
        isCall: false,
        isClickedAnswer: false,
        isCallee: null,
        camera: true,
        mic: false
      })
      this.pc = new RTCPeerConnection(pc_config)
      this.connectCall()
    })

    this.pc = new RTCPeerConnection(pc_config)
    this.connectCall()
  }

  sendToPeer = (messageType, payload) => {
    this.socket.emit(messageType, {
      socketID: this.socket.id,
      payload
    })
  }

  /* ACTION METHODS FROM THE BUTTONS ON SCREEN */

  createOffer = () => {
    console.log('Offer')
    this.setState({
      ...this.state,
      isCall: true
    })
    this.pc.createOffer({ offerToReceiveVideo: 1 })
      .then(sdp => {
        console.log("set local sdp và gửi sdp");
        this.pc.setLocalDescription(sdp)

        this.sendToPeer('offerOrAnswer', sdp)
      })
  }

  createAnswer = () => {
    console.log('Answer')
    this.setState({
      ...this.state,
      isClickedAnswer: true
    })
    this.pc.createAnswer({ offerToReceiveVideo: 1 })
      .then(sdp => {
        console.log("set local sdp và gửi sdp");
        this.pc.setLocalDescription(sdp)

        this.sendToPeer('offerOrAnswer', sdp)
      })
  }

  cancelCall= () => {
    console.log("Hủy");
    this.pc.close()
    this.sendToPeer("stopCall", null)
    this.setState({
      isCall: false,
      isClickedAnswer: false,
      isCallee: null,
      camera: true,
      mic: false
    })
    this.pc = new RTCPeerConnection(pc_config)
    this.connectCall()
    // this.remoteVideoref.current.srcObject = null;
  }

  onOffCam = () => {
    this.stream.getVideoTracks()[0].enabled = !this.state.camera
    this.setState({
      ...this.state,
      camera: !this.state.camera
    })
  }

  onOffMic = () => {
    this.stream.getAudioTracks()[0].enabled = !this.state.mic
    this.setState({
      ...this.state,
      mic: !this.state.mic
    })
  }

  connectCall = () => {
    // triggered when a new candidate is returned
    this.pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("gửi candidate cho máy khác")
        this.sendToPeer('candidate', e.candidate)
      }
    }

    // triggered when there is a change in connection state
    this.pc.oniceconnectionstatechange = (e) => {
      console.log("thiết lập thành công", e)
    }

    // triggered when a stream is added to pc, see below - this.pc.addStream(stream)
    // this.pc.onaddstream = (e) => {
    //   this.remoteVideoref.current.srcObject = e.stream
    // }

    this.pc.ontrack = (e) => {
      console.log("nhận dòng video");
      this.remoteVideoref.current.srcObject = e.streams[0]
    }

    // getUserMedia() returns a MediaStream object 
    const success = (stream) => {
      this.stream = stream
      this.localVideoref.current.srcObject = stream
      for (const track of stream.getTracks()) {
        this.pc.addTrack(track, stream);
      }
    }

    const failure = (e) => {
      console.log('getUserMedia Error: ', e)
    }

    const constraints = {
      audio: true,
      video: true,
      // video: {
      //   width: 1280,
      //   height: 720
      // },
      // video: {
      //   width: { min: 1280 },
      // }
      options: {
        mirror: true,
      }
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then(success)
      .catch(failure)
  }

  render() {
    const {isCall, isCallee, isClickedAnswer} = this.state

    return (
      <div className="container">
        <div className="video-container">
          <div className="videoBox">
            <video
              className="videoLocal"
              ref={this.localVideoref}
              autoPlay muted>
            </video>
            <video
              className="videoRemote"
              ref={this.remoteVideoref}
              autoPlay>
            </video>
            <div className="button-group">
              {!isCall && <button className="button-call btn-call" onClick={this.createOffer}>Gọi</button>}
              {!isClickedAnswer && isCallee && <button className="button-call btn-answer" onClick={this.createAnswer}>Trả lời</button>}
              {isCall && <button className="button-call btn-cancel" onClick={this.cancelCall}>Hủy</button>}
              {isCall && <button className="button-call btn-camera" onClick={this.onOffCam}>Cam</button>}
              {isCall && <button className="button-call btn-audio" onClick={this.onOffMic}>Mic</button>}
            </div>
          </div>
          {/* <textarea style={{ width: 450, height: 40, display: "none" }} ref={ref => { this.textref = ref }} /> */}
        </div>
      </div>
    )
  }
}

export default App;