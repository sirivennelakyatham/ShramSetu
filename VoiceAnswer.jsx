
import { useRef, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function VoiceAnswer({ language = "en", onTranscript }) {
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startRecording() {
    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        await sendAudio(audioBlob);
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      setError("Microphone access failed. Please allow microphone permission.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      setRecording(false);
      setLoading(true);
    }
  }

  async function sendAudio(blob) {
    try {
      const formData = new FormData();
      formData.append("audio_file", blob, "recording.webm");
      formData.append("language", language);

      const response = await fetch(`${API_URL}/speech/transcribe`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Transcription failed.");
      }

      onTranscript?.(result.transcript);
    } catch (err) {
      setError(err.message || "Could not transcribe the recording.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="voice-answer">
      {!recording ? (
        <button type="button" onClick={startRecording} disabled={loading}>
          {loading ? "Transcribing..." : "🎙️ Start speaking"}
        </button>
      ) : (
        <button type="button" onClick={stopRecording}>
          Stop recording
        </button>
      )}

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
