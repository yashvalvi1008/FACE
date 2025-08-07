import * as faceapi from 'face-api.js'

export class BrowserFaceRecognitionService {
  private static instance: BrowserFaceRecognitionService
  private isInitialized = false

  static getInstance(): BrowserFaceRecognitionService {
    if (!BrowserFaceRecognitionService.instance) {
      BrowserFaceRecognitionService.instance = new BrowserFaceRecognitionService()
    }
    return BrowserFaceRecognitionService.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Load face-api.js models from public directory
      const MODEL_URL = '/models'
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
      ])
      
      this.isInitialized = true
      console.log('Face recognition models loaded successfully')
    } catch (error) {
      console.error('Failed to load face recognition models:', error)
      throw error
    }
  }

  async detectFace(
    input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): Promise<faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>> | null> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const detection = await faceapi
        .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()

      return detection || null
    } catch (error) {
      console.error('Face detection failed:', error)
      return null
    }
  }

  async extractFaceDescriptor(
    input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): Promise<Float32Array | null> {
    const detection = await this.detectFace(input)
    return detection ? detection.descriptor : null
  }

  compareFaces(descriptor1: Float32Array, descriptor2: Float32Array): number {
    return faceapi.euclideanDistance(descriptor1, descriptor2)
  }

  isFaceMatch(
    descriptor1: Float32Array, 
    descriptor2: Float32Array, 
    threshold: number = 0.6
  ): boolean {
    const distance = this.compareFaces(descriptor1, descriptor2)
    return distance < threshold
  }

  async findBestMatch(
    inputDescriptor: Float32Array,
    knownDescriptors: { id: number; descriptor: Float32Array; name: string }[]
  ): Promise<{ id: number; name: string; confidence: number } | null> {
    let bestMatch = null
    let bestDistance = Infinity

    for (const known of knownDescriptors) {
      const distance = this.compareFaces(inputDescriptor, known.descriptor)
      if (distance < bestDistance && distance < 0.6) {
        bestDistance = distance
        bestMatch = {
          id: known.id,
          name: known.name,
          confidence: 1 - distance
        }
      }
    }

    return bestMatch
  }

  // Helper method to create canvas from video for processing
  createCanvasFromVideo(video: HTMLVideoElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    
    return canvas
  }

  // Helper method to resize image for better performance
  resizeCanvas(
    sourceCanvas: HTMLCanvasElement, 
    maxWidth: number = 640, 
    maxHeight: number = 480
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    const { width, height } = sourceCanvas
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    
    canvas.width = width * ratio
    canvas.height = height * ratio
    
    ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height)
    
    return canvas
  }
}
