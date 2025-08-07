import * as faceapi from 'face-api.js'

export class FaceRecognitionService {
  private static instance: FaceRecognitionService
  private isInitialized = false

  static getInstance(): FaceRecognitionService {
    if (!FaceRecognitionService.instance) {
      FaceRecognitionService.instance = new FaceRecognitionService()
    }
    return FaceRecognitionService.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Load face-api.js models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      ])
      
      this.isInitialized = true
      console.log('Face recognition models loaded successfully')
    } catch (error) {
      console.error('Failed to load face recognition models:', error)
      throw error
    }
  }

  async detectFace(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>>> | null> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const detection = await faceapi
        .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()

      return detection || null
    } catch (error) {
      console.error('Face detection failed:', error)
      return null
    }
  }

  async extractFaceDescriptor(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<Float32Array | null> {
    const detection = await this.detectFace(imageElement)
    return detection ? detection.descriptor : null
  }

  compareFaces(descriptor1: Float32Array, descriptor2: Float32Array): number {
    return faceapi.euclideanDistance(descriptor1, descriptor2)
  }

  isFaceMatch(descriptor1: Float32Array, descriptor2: Float32Array, threshold: number = 0.6): boolean {
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
          confidence: 1 - distance // Convert distance to confidence score
        }
      }
    }

    return bestMatch
  }
}
