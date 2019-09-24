// Detection
const webcam = document.getElementById("webcam");
const webCanvas = document.getElementById("webcam-canvas");
const context = webCanvas.getContext("2d");

let position = 250;
let imgindex = 1
let model = null;
let videoInterval = 100

const modelParams = {
  flipHorizontal: true, // flip e.g for webcam  
  maxNumBoxes: 1, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold for predictions.
}

function startVideo() {
  handTrack.startVideo(webcam).then(function (status) {
    runDetection()
  });
}

startVideo();

function runDetection() {
  model.detect(webcam).then(predictions => {

    // get the middle x value of the bounding box and map to paddle location
    model.renderPredictions(predictions, webCanvas, context, webcam);
    if (predictions[0]) {
      position = predictions[0].bbox[0];
    } else {
      // No moviment player with this value
      position = 245;
    }
    if(hasGameStarted === false) {
      initGame();
      hasGameStarted = true;
    }

    setTimeout(() => {
      runDetection(webcam)
    }, videoInterval);
  });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
  // detect objects in the image.
  model = lmodel
});
