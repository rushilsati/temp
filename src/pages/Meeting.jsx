import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Peer } from "peerjs";

import ShareModal from "../components/ShareModal";
import Controls from "../components/Controls";
import { PEER_SERVER_CONFIG, SERVER_URL } from "../config";
import reducer, { ADD_STREAM, REMOVE_STREAM } from "../reducers";

const Meeting = () => {
  const [peer, setPeer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [micOff, setMicOff] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [cameraOff, setCameraOff] = useState(false);
  const [showPopper, setShowPopper] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [someonePresenting, setSomeonePresenting] = useState(false);

  const navigate = useNavigate();

  const [streams, dispatch] = useReducer(reducer, {});

  const myStreamRef = useRef(null);

  const screenSharingRef = useRef();

  const { meetingCode } = useParams();

  const handleToggleCamera = () => {
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setCameraOff((prevCameraOff) => !prevCameraOff);
  };

  const handleToggleMic = () => {
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setMicOff((prevMicOff) => !prevMicOff);
  };

  const handleScreenSharing = async () => {
    try {
      if (!peer) return;
      if (!screenStream) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: true,
          },
          audio: true,
        });
        setSomeonePresenting(true);

        console.log(stream);
        setScreenStream(stream);
        screenSharingRef.current.srcObject = stream;

        stream.getVideoTracks()[0].onended = () => {
          setSomeonePresenting(false);
          setScreenStream(null);
          socket.emit("screen-sharing-ended");
        };

        socket.emit("screen-sharing");

        peer.on("call", (call) => {
          if (call.metadata.type === "screensharing") {
            call.answer(stream);
          }
        });
      } else {
        const tracks = screenStream.getTracks();
        for (let i = 0; i < tracks.length; i++) tracks[i].stop();
        setSomeonePresenting(false);
        setScreenStream(null);
      }
    } catch (error) {}
  };

  const handleEndCall = () => {
    if (myStream) {
      const tracks = myStream.getTracks();
      for (let i = 0; i < tracks.length; i++) tracks[i].stop();
    }

    if (screenStream) {
      const tracks = screenStream.getTracks();
      for (let i = 0; i < tracks.length; i++) tracks[i].stop();
    }

    navigate("/");
  };

  const handleConnection = useCallback(() => {
    socket.emit("join-meet", { meetingCode, me: peer.id });

    socket.on("partner-connected", (partner) => {
      setShowPopper(true);

      setTimeout(() => {
        setShowPopper(false);
      }, 5000);

      const call = peer.call(partner, myStream, {
        metadata: {
          type: "camera",
        },
      });

      call.on("stream", (stream) => {
        dispatch({ type: ADD_STREAM, payload: { [call.peer]: stream } });
      });
    });

    peer.on("call", (call) => {
      if (call.metadata.type === "camera") {
        call.answer(myStream);

        call.on("stream", (stream) => {
          dispatch({ type: ADD_STREAM, payload: { [call.peer]: stream } });
        });
      }
    });

    socket.on("partner-left", (partner) => {
      dispatch({ type: REMOVE_STREAM, payload: partner });
    });

    socket.on("screen-sharing-ended", () => {
      setSomeonePresenting(false);
      screenSharingRef.current.srcObject = null;
    });

    socket.on("screen-sharing", (partner) => {
      const call = peer.call(partner, myStream, {
        metadata: {
          type: "screensharing",
        },
      });
      call.on("stream", (stream) => {
        setSomeonePresenting(true);
        screenSharingRef.current.srcObject = stream;
      });
    });
  }, [socket, peer, meetingCode, myStream]);

  const getMyStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myStreamRef.current.srcObject = stream;

    setMyStream(stream);
  }, []);

  useEffect(() => {
    getMyStream();

    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    const newPeer = new Peer(PEER_SERVER_CONFIG);
    setPeer(newPeer);

    return () => {
      newPeer.destroy();
      newSocket.disconnect();
    };
  }, [getMyStream]);

  useEffect(() => {
    if (myStream === null) return;

    return () => {
      const tracks = myStream.getTracks();
      tracks.forEach((track) => track.stop());
    };
  }, [myStream]);

  useEffect(() => {
    if (socket === null || peer === null) return;

    peer.addListener("open", handleConnection);

    return () => peer.removeListener("open");
  }, [socket, peer, myStream, meetingCode, handleConnection]);

  const handleCloseShareToggle = () => {
    setShowModal(false);
  };

  return (
    <div className="flex justify-center items-center h-full bg-[#202124]">
      {showModal && (
        <ShareModal meetingCode={meetingCode} close={handleCloseShareToggle} />
      )}
      <div
        className={`${
          someonePresenting ? "flex" : "hidden"
        } justify-center items-center w-[65%]`}
      >
        <video
          autoPlay
          ref={screenSharingRef}
          className="h-full rounded-lg object-cover"
        ></video>
      </div>
      <div
        className={`${
          someonePresenting ? "w-[30%]" : "w-full"
        } grid gap-[10px] p-[10px] overflow-auto h-screen justify-items-center place-self-center grid-flow-row`}
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        <div className="flex justify-center items-center h-full">
          <video
            muted
            autoPlay
            ref={myStreamRef}
            style={{
              transform: "rotateY(180deg)",
            }}
            className="w-full h-full rounded-lg object-cover"
          ></video>
        </div>

        {Object.values(streams).map((stream, index) => {
          return (
            <video
              autoPlay
              key={index}
              ref={(ref) => {
                if (!ref) return;
                ref.srcObject = stream;
              }}
              style={{ transform: "rotateY(180deg)" }}
              className="h-full w-full rounded-lg object-cover"
            ></video>
          );
        })}
      </div>
      <Controls
        micOff={micOff}
        cameraOff={cameraOff}
        meetingCode={meetingCode}
        screenStream={screenStream}
        handleEndCall={handleEndCall}
        handleToggleMic={handleToggleMic}
        handleToggleCamera={handleToggleCamera}
        handleScreenSharing={handleScreenSharing}
      />
      {showPopper && (
        <div className="bg-white absolute bottom-[25px] right-[25px] p-[10px] rounded-lg text-[12px] font-[800]">
          SOMEONE JOINED THE MEET
        </div>
      )}
    </div>
  );
};

export default Meeting;
