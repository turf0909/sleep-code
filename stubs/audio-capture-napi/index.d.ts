export declare function isNativeAudioAvailable(): boolean
export declare function isNativeRecordingActive(): boolean
export declare function startNativeRecording(
  onData: (data: Buffer) => void,
  onEnd: () => void
): boolean
export declare function stopNativeRecording(): void
