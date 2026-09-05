/**
 * Synthesizes an audible 16-bit PCM WAV audio file with natural speech/voice cadence.
 * Ensures the audio has an actual duration (e.g. 25-45s) and harmonic vocal tones
 * so that playback, scrubbing, waveform animation, and transcript sync work 100%.
 */
export function createAudibleSampleAudio(filename: string, durationSeconds: number = 32): File {
  const sampleRate = 22050; // Standard speech audio sample rate
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * 2; // 16-bit mono = 2 bytes per sample
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // 1. RIFF Header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // ChunkSize
  writeString(view, 8, 'WAVE');

  // 2. "fmt " Subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true);  // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * 1 * 2)
  view.setUint16(32, 2, true);  // BlockAlign (1 * 2)
  view.setUint16(34, 16, true); // BitsPerSample (16 bits)

  // 3. "data" Subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // 4. Generate harmonic speech-like formant frequencies with natural pauses
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Simulate conversational rhythm & breath pauses (0.5s pause every ~4s)
    const sentenceRhythm = (t % 4.5);
    const isSpeaking = sentenceRhythm < 3.8;

    if (!isSpeaking) {
      view.setInt16(44 + i * 2, 0, true);
      continue;
    }

    // Syllable rhythm modulation (~3-4 syllables per second)
    const syllableEnvelope = Math.max(0, Math.sin(2 * Math.PI * 3.5 * t));

    // Pitch inflection & formant vocal tones (F0 ~ 140Hz-220Hz + Formants F1, F2)
    const f0 = 160 + Math.sin(2 * Math.PI * 0.8 * t) * 25 + Math.sin(2 * Math.PI * 2.2 * t) * 15;
    const f1 = f0 * 3; // Formant 1
    const f2 = f0 * 5; // Formant 2

    const rawSignal =
      Math.sin(2 * Math.PI * f0 * t) * 0.5 +
      Math.sin(2 * Math.PI * f1 * t) * 0.25 +
      Math.sin(2 * Math.PI * f2 * t) * 0.12;

    const sample = rawSignal * syllableEnvelope * 0.4;

    // Clamp to 16-bit PCM integer range
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, intSample, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return new File([blob], `${filename}.wav`, { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
