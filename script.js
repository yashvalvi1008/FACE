class FacialRecognitionAttendance {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('overlay');
        this.ctx = this.canvas.getContext('2d');
        this.status = document.getElementById('status');
        
        this.isModelLoaded = false;
        this.isVideoStarted = false;
        this.stream = null;
        this.detectionInterval = null;
        
        this.registeredFaces = JSON.parse(localStorage.getItem('registeredFaces')) || [];
        this.todayAttendance = JSON.parse(localStorage.getItem('todayAttendance')) || [];
        
        this.initializeEventListeners();
        this.loadModels();
        this.updateUI();
    }

    async loadModels() {
        try {
            this.updateStatus('Loading face detection models...', 'loading');
            
            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/';
            
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
            ]);
            
            this.isModelLoaded = true;
            this.updateStatus('Models loaded successfully! Ready to use.', 'ready');
            this.enableButtons();
        } catch (error) {
            console.error('Error loading models:', error);
            this.updateStatus('Error loading models. Please refresh the page.', 'error');
        }
    }

    initializeEventListeners() {
        document.getElementById('startCamera').addEventListener('click', () => this.startCamera());
        document.getElementById('stopCamera').addEventListener('click', () => this.stopCamera());
        document.getElementById('markAttendance').addEventListener('click', () => this.markAttendance());
        document.getElementById('registerPerson').addEventListener('click', () => this.registerPerson());
        document.getElementById('clearAttendance').addEventListener('click', () => this.clearAttendance());
        
        document.getElementById('personName').addEventListener('input', (e) => {
            const registerBtn = document.getElementById('registerPerson');
            registerBtn.disabled = !e.target.value.trim() || !this.isVideoStarted;
        });
    }

    updateStatus(message, type = '') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
    }

    enableButtons() {
        if (this.isModelLoaded) {
            document.getElementById('startCamera').disabled = false;
        }
    }

    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            this.video.srcObject = this.stream;
            
            this.video.addEventListener('loadedmetadata', () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
            });

            await this.video.play();
            this.isVideoStarted = true;
            
            document.getElementById('startCamera').disabled = true;
            document.getElementById('stopCamera').disabled = false;
            document.getElementById('markAttendance').disabled = false;
            
            const personName = document.getElementById('personName').value.trim();
            document.getElementById('registerPerson').disabled = !personName;
            
            this.startFaceDetection();
            this.updateStatus('Camera started. Face detection active.', 'ready');
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.updateStatus('Error accessing camera. Please check permissions.', 'error');
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }
        
        this.video.srcObject = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isVideoStarted = false;
        
        document.getElementById('startCamera').disabled = false;
        document.getElementById('stopCamera').disabled = true;
        document.getElementById('markAttendance').disabled = true;
        document.getElementById('registerPerson').disabled = true;
        
        this.updateStatus('Camera stopped.', '');
    }

    startFaceDetection() {
        this.detectionInterval = setInterval(async () => {
            if (this.video.readyState === 4) {
                await this.detectFaces();
            }
        }, 100);
    }

    async detectFaces() {
        try {
            const detections = await faceapi.detectAllFaces(
                this.video,
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks().withFaceDescriptors();

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (detections.length > 0) {
                detections.forEach(detection => {
                    const { x, y, width, height } = detection.detection.box;
                    
                    // Draw detection box
                    this.ctx.strokeStyle = '#48bb78';
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeRect(x, y, width, height);
                    
                    // Try to match with registered faces
                    const match = this.findFaceMatch(detection.descriptor);
                    if (match) {
                        this.ctx.fillStyle = '#48bb78';
                        this.ctx.fillRect(x, y - 25, match.name.length * 8 + 16, 25);
                        this.ctx.fillStyle = 'white';
                        this.ctx.font = '12px Arial';
                        this.ctx.fillText(match.name, x + 8, y - 8);
                    }
                });
            }
        } catch (error) {
            console.error('Error in face detection:', error);
        }
    }

    findFaceMatch(descriptor) {
        const threshold = 0.6;
        
        for (const registeredFace of this.registeredFaces) {
            const distance = faceapi.euclideanDistance(descriptor, registeredFace.descriptor);
            if (distance < threshold) {
                return registeredFace;
            }
        }
        return null;
    }

    async registerPerson() {
        const personName = document.getElementById('personName').value.trim();
        if (!personName) {
            alert('Please enter a person\'s name.');
            return;
        }

        try {
            const detections = await faceapi.detectAllFaces(
                this.video,
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks().withFaceDescriptors();

            if (detections.length === 0) {
                alert('No face detected. Please make sure your face is visible in the camera.');
                return;
            }

            if (detections.length > 1) {
                alert('Multiple faces detected. Please make sure only one person is in the frame.');
                return;
            }

            const faceDescriptor = detections[0].descriptor;
            
            // Check if person already exists
            const existingPerson = this.registeredFaces.find(face => face.name.toLowerCase() === personName.toLowerCase());
            if (existingPerson) {
                alert('A person with this name is already registered.');
                return;
            }

            const newFace = {
                id: Date.now(),
                name: personName,
                descriptor: Array.from(faceDescriptor),
                registeredAt: new Date().toISOString()
            };

            this.registeredFaces.push(newFace);
            localStorage.setItem('registeredFaces', JSON.stringify(this.registeredFaces));
            
            document.getElementById('personName').value = '';
            document.getElementById('registerPerson').disabled = true;
            
            this.updateRegisteredFacesUI();
            alert(`${personName} has been registered successfully!`);
        } catch (error) {
            console.error('Error registering person:', error);
            alert('Error registering person. Please try again.');
        }
    }

    async markAttendance() {
        try {
            const detections = await faceapi.detectAllFaces(
                this.video,
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks().withFaceDescriptors();

            if (detections.length === 0) {
                alert('No face detected. Please make sure your face is visible in the camera.');
                return;
            }

            const recognizedPeople = [];
            
            detections.forEach(detection => {
                const match = this.findFaceMatch(detection.descriptor);
                if (match) {
                    recognizedPeople.push(match);
                }
            });

            if (recognizedPeople.length === 0) {
                alert('No registered faces recognized. Please register first or make sure your face is clearly visible.');
                return;
            }

            const today = new Date().toDateString();
            let newAttendances = 0;

            recognizedPeople.forEach(person => {
                const existingAttendance = this.todayAttendance.find(
                    att => att.name === person.name && att.date === today
                );

                if (!existingAttendance) {
                    this.todayAttendance.push({
                        id: Date.now() + Math.random(),
                        name: person.name,
                        date: today,
                        time: new Date().toLocaleTimeString(),
                        timestamp: new Date().toISOString()
                    });
                    newAttendances++;
                }
            });

            if (newAttendances > 0) {
                localStorage.setItem('todayAttendance', JSON.stringify(this.todayAttendance));
                this.updateAttendanceUI();
                alert(`Attendance marked for ${newAttendances} person(s)!`);
            } else {
                alert('Attendance already marked for all recognized faces today.');
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            alert('Error marking attendance. Please try again.');
        }
    }

    clearAttendance() {
        if (confirm('Are you sure you want to clear today\'s attendance records?')) {
            this.todayAttendance = [];
            localStorage.setItem('todayAttendance', JSON.stringify(this.todayAttendance));
            this.updateAttendanceUI();
        }
    }

    updateUI() {
        this.updateAttendanceUI();
        this.updateRegisteredFacesUI();
    }

    updateAttendanceUI() {
        const attendanceList = document.getElementById('attendanceList');
        const today = new Date().toDateString();
        const todayRecords = this.todayAttendance.filter(att => att.date === today);

        if (todayRecords.length === 0) {
            attendanceList.innerHTML = '<p>No attendance records for today.</p>';
        } else {
            attendanceList.innerHTML = todayRecords.map(record => `
                <div class="attendance-item">
                    <span class="name">${record.name}</span>
                    <span class="time">${record.time}</span>
                </div>
            `).join('');
        }
    }

    updateRegisteredFacesUI() {
        const facesGrid = document.getElementById('facesGrid');
        
        if (this.registeredFaces.length === 0) {
            facesGrid.innerHTML = '<p>No faces registered yet.</p>';
        } else {
            facesGrid.innerHTML = this.registeredFaces.map(face => `
                <div class="face-card">
                    <div class="name">${face.name}</div>
                    <div class="registered-time">
                        Registered: ${new Date(face.registeredAt).toLocaleDateString()}
                    </div>
                </div>
            `).join('');
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FacialRecognitionAttendance();
});
