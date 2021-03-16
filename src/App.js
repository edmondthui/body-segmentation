import React, { useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const bodySegment = async () => {
    const neuralNetwork = await bodyPix.load();
    setInterval(() => {
      detectBackground(neuralNetwork);
    });
  };

  const detectBackground = async (neuralNetwork) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      let videoHeight = video.videoHeight;
      let videoWidth = video.videoWidth;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const person = await neuralNetwork.segmentPersonParts(video);

      const bodyParts = bodyPix.toColoredPartMask(person);
      bodyPix.drawMask(canvasRef.current, video, bodyParts, 0.5, 0, false);
    }
  };

  bodySegment();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 1,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 1,
            width: 640,
            height: 480,
          }}
        ></canvas>
      </header>
    </div>
  );
}

export default App;
