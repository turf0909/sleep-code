// Stub for audio-capture-napi
// Native audio recording not available - voice features will use SoX/arecord fallback

let recording = false

export function isNativeAudioAvailable() {
  return false
}

export function isNativeRecordingActive() {
  return recording
}

export function startNativeRecording(onData, onEnd) {
  console.warn('[audio-capture-napi] Native audio not available. Voice features will use command-line fallback (SoX/arecord).')
  recording = false
  return false
}

export function stopNativeRecording() {
  recording = false
}
