
import React, { useRef, useState } from "react";
import { Mic, Square, LoaderCircle } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

// Convert browser-recorded audio into PCM WAV.
// This is audio-format conversion, not another speech model.
async function convertToWav(audioBlob) {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error("Your browser does not support audio conversion.");
  }

  const audioContext = new AudioContextClass();

  try {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const decoded = await audioContext.decodeAudioData(arrayBuffer);

    const channels = decoded.numberOfChannels;
    const sampleRate = decoded.sampleRate;
    const frameCount = decoded.length;

    // Mix channels into mono.
    const mono = new Float32Array(frameCount);

    for (let channel = 0; channel < channels; channel++) {
      const channelData = decoded.getChannelData(channel);

      for (let i = 0; i < frameCount; i++) {
        mono[i] += channelData[i] / channels;
      }
    }

    const bytesPerSample = 2;
    const dataSize = frameCount * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    const writeString = (offset, value) => {
      for (let i = 0; i < value.length; i++) {
        view.setUint8(offset + i, value.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * bytesPerSample, true);
    view.setUint16(32, bytesPerSample, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, dataSize, true);

    let offset = 44;

    for (let i = 0; i < frameCount; i++) {
      const sample = Math.max(-1, Math.min(1, mono[i]));
      const value = sample < 0
        ? sample * 0x8000
        : sample * 0x7fff;

      view.setInt16(offset, value, true);
      offset += 2;
    }

    return new Blob([buffer], { type: "audio/wav" });
  } finally {
    await audioContext.close();
  }
}

export default function VoiceInput({
  language,
  onTranscript,
  disabled = false,
}) {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    mediaRecorderRef.current = null;
  };

  const startRecording = async () => {
    setError("");

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("Your browser does not support microphone recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ].find((type) => MediaRecorder.isTypeSupported(type));

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setError("Recording failed. Please try again.");
        setRecording(false);
        cleanup();
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        cleanup();

        if (!audioBlob.size) {
          setError("No audio was recorded. Please try again.");
          return;
        }

        await transcribe(audioBlob);
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      cleanup();

      if (err.name === "NotAllowedError") {
        setError("Please allow microphone access in your browser.");
      } else {
        setError("Could not access the microphone. Please try again.");
      }
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      setRecording(false);
      recorder.stop();
    }
  };

  const transcribe = async (audioBlob) => {
    setProcessing(true);
    setError("");

    try {
      // Convert WebM/MP4 recording into WAV for Gnani STT.
      const wavBlob = await convertToWav(audioBlob);

      const formData = new FormData();
      formData.append("audio_file", wavBlob, "recording.wav");
      formData.append("language", language);

      const response = await fetch(
        `${API_BASE_URL}/speech/transcribe`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Speech recognition failed.");
      }

      if (!data.success || !data.transcript?.trim()) {
        throw new Error("No speech was recognised. Please try again.");
      }

      onTranscript(data.transcript.trim());
    } catch (err) {
      setError(err.message || "Could not transcribe your recording.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="voice-input">
      <button
        type="button"
        className={`voice-input-button ${recording ? "recording" : ""}`}
        onClick={recording ? stopRecording : startRecording}
        disabled={disabled || processing}
      >
        {processing ? (
          <LoaderCircle className="report-spinner" size={18} />
        ) : recording ? (
          <Square size={17} />
        ) : (
          <Mic size={19} />
        )}

        {processing
          ? "Transcribing..."
          : recording
          ? "Stop recording"
          : "Speak"}
      </button>

      {recording && (
        <span className="voice-input-status">
          Listening... Tap Stop when finished.
        </span>
      )}

      {error && (
        <p className="report-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
