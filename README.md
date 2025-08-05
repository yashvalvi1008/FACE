# Facial Recognition Attendance System

A web-based attendance system that uses facial recognition technology to automatically track attendance. Built with HTML, CSS, JavaScript, and the Face-API.js library.

## Features

- **Real-time Face Detection**: Uses your webcam to detect faces in real-time
- **Face Registration**: Register new people by capturing their facial features
- **Automatic Recognition**: Recognizes registered faces and displays their names
- **Attendance Tracking**: Mark attendance for recognized individuals
- **Local Storage**: All data is stored locally in your browser
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean and intuitive user interface

## How to Use

### 1. Setup
- Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
- Allow camera permissions when prompted
- Wait for the face detection models to load (this may take a few moments on first load)

### 2. Register People
1. Click "Start Camera" to begin video capture
2. Enter a person's name in the registration field
3. Make sure only one person's face is visible in the camera
4. Click "Register Face" to save their facial features
5. Repeat for all people you want to track

### 3. Mark Attendance
1. With the camera running, have the person stand in front of the camera
2. The system will automatically detect and recognize registered faces
3. Click "Mark Attendance" to record their attendance for today
4. The attendance list will update automatically

### 4. View Records
- Today's attendance records are displayed in the "Today's Attendance" section
- Registered faces are shown in the "Registered Faces" section
- Use "Clear Today's Records" to reset attendance for the current day

## Technical Requirements

- Modern web browser with WebRTC support
- Webcam access
- Internet connection (for loading Face-API.js models)
- HTTPS connection (required for camera access in production)

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Privacy & Security

- All facial data is stored locally in your browser's localStorage
- No data is sent to external servers
- Face recognition processing happens entirely in your browser
- You can clear all data by clearing your browser's localStorage

## Troubleshooting

### Camera Not Working
- Ensure you've granted camera permissions
- Check if another application is using the camera
- Try refreshing the page
- Use HTTPS if accessing remotely

### Face Not Recognized
- Ensure good lighting conditions
- Face should be clearly visible and facing the camera
- Try re-registering the person if recognition is poor
- Make sure only one face is visible during registration

### Models Not Loading
- Check your internet connection
- Try refreshing the page
- Clear browser cache if issues persist

## File Structure

```
facial-recognition-attendance/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Technologies Used

- **HTML5**: Structure and video capture
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Application logic
- **Face-API.js**: Face detection and recognition
- **WebRTC**: Camera access
- **Canvas API**: Drawing detection boxes and labels

## Limitations

- Requires good lighting for optimal face detection
- Performance depends on device capabilities
- Face recognition accuracy may vary
- Limited to browser localStorage capacity
- Requires internet connection for initial model loading

## Future Enhancements

- Export attendance data to CSV/Excel
- Multiple attendance sessions per day
- Face recognition confidence scores
- Admin panel for managing users
- Database integration for persistent storage
- Mobile app version

## License

This project is open source and available under the MIT License.
