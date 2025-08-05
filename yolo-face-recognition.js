function findBestFaceMatch(descriptor) {
  const threshold = 0.45; // Or your chosen threshold
  let bestMatch = null;
  let bestDistance = threshold;
  for (const registeredFace of this.registeredFaces) {
    // The important part: convert here!
    const storedDescriptor = new Float32Array(registeredFace.descriptor);
    const distance = faceapi.euclideanDistance(descriptor, storedDescriptor);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = {
        ...registeredFace,
        distance,
        confidence: 1 - distance
      };
    }
  }
  return bestMatch;
}


async function recognizeMultipleFaces(faceBoxes) {
  // faceBoxes: array of {x, y, width, height} in video coordinates.
  const matches = [];
  for (const faceBox of faceBoxes) {
    // Crop face region to a canvas
    const faceCanvas = document.createElement('canvas');
    const faceCtx = faceCanvas.getContext('2d');
    faceCanvas.width = faceBox.width;
    faceCanvas.height = faceBox.height;
    faceCtx.drawImage(
      this.video,
      faceBox.x, faceBox.y, faceBox.width, faceBox.height,
      0, 0, faceBox.width, faceBox.height
    );
    const detections = await faceapi.detectAllFaces(
      faceCanvas,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
    ).withFaceLandmarks().withFaceDescriptors();
    if (detections.length > 0) {
      const bestMatch = this.findBestFaceMatch(detections[0].descriptor);
      if (
        bestMatch &&
        !matches.find(p => p.name === bestMatch.name)
      ) {
        matches.push(bestMatch);
      }
    }
  }
  return matches;
}

async function markAttendance() {
  try {
    // Use YOLO/BlazeFace for detection
    const yoloPredictions = await this.yoloModel.estimateFaces(this.video, false);
    if (yoloPredictions.length === 0) {
      alert('No face detected. Please make sure your face is visible in the camera.');
      return;
    }
    // Map all detected face boxes
    const faceBoxes = yoloPredictions.map(pred => this.extractFaceBox(pred));
    const recognizedPeople = await this.recognizeMultipleFaces(faceBoxes);

    if (recognizedPeople.length === 0) {
      alert('No registered faces recognized with sufficient confidence. Please register first or ensure good lighting.');
      return;
    }
    const today = new Date().toDateString();
    let newAttendances = 0;
    recognizedPeople.forEach(person => {
      if (person && person.confidence > 0.7) {
        const existingAttendance = this.todayAttendance.find(
          att => att.name === person.name && att.date === today
        );
        if (!existingAttendance) {
          this.todayAttendance.push({
            id: Date.now() + Math.random(),
            name: person.name,
            date: today,
            time: new Date().toLocaleTimeString(),
            timestamp: new Date().toISOString(),
            confidence: person.confidence,
            method: 'YOLO+FaceAPI'
          });
          newAttendances++;
        }
      }
    });

    if (newAttendances > 0) {
      localStorage.setItem('todayAttendance', JSON.stringify(this.todayAttendance));
      this.updateAttendanceUI();
      alert(`Attendance marked for ${newAttendances} person(s) using YOLO detection!`);
    } else {
      alert('Attendance already marked for all recognized faces today.');
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
    alert('Error marking attendance. Please try again.');
  }
}
