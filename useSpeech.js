
import { useRef, useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000";
const MAX_CHUNK_LENGTH = 1500;
const PAUSE_BETWEEN_CHUNKS = 800;

function splitTextIntoChunks(text) {
  const sentences = text
    .replace(/\r/g, "\n")
    .split(/(?<=[.!?।॥])\s+|\n+/)
    .map((part) => part.replace(/^[\s•●▪◦*-]+/, "").trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";

  const addLongSentence = (sentence) => {
    const words = sentence.split(/\s+/);
    let part = "";

    for (const word of words) {
      if (word.length > MAX_CHUNK_LENGTH) {
        if (part) {
          chunks.push(part);
          part = "";
        }

        for (let i = 0; i < word.length; i += MAX_CHUNK_LENGTH) {
          chunks.push(word.slice(i, i + MAX_CHUNK_LENGTH));
        }
        continue;
      }

      const candidate = part ? `${part} ${word}` : word;

      if (candidate.length > MAX_CHUNK_LENGTH) {
        if (part) chunks.push(part);
        part = word;
      } else {
        part = candidate;
      }
    }

    if (part) chunks.push(part);
  };

  for (const sentence of sentences) {
    if (sentence.length > MAX_CHUNK_LENGTH) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      addLongSentence(sentence);
      continue;
    }

    const candidate = current ? `${current} ${sentence}` : sentence;

    if (candidate.length > MAX_CHUNK_LENGTH) {
      if (current) chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

export default function useSpeech(language) {
  const audioRef = useRef(null);
  const urlRefs = useRef([]);
  const runIdRef = useRef(0);

  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    urlRefs.current.forEach((url) => URL.revokeObjectURL(url));
    urlRefs.current = [];
  };

  const stopSpeech = () => {
    runIdRef.current += 1;
    clearAudio();
    setSpeaking(false);
    setLoading(false);
  };

  const speak = async (text) => {
    if (!text || !text.trim()) return;

    stopSpeech();

    const currentRun = runIdRef.current;
    const chunks = splitTextIntoChunks(text);

    setError("");
    setLoading(true);

    try {
      const audioUrls = [];

      for (const chunk of chunks) {
        if (currentRun !== runIdRef.current) return;

        const response = await fetch(`${API_URL}/audio/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: chunk, language }),
        });

        if (!response.ok) {
          const details = await response.text();
          throw new Error(details || "Speech generation failed.");
        }

        const blob = await response.blob();

        if (!blob.size) {
          throw new Error("No audio was returned.");
        }

        const url = URL.createObjectURL(blob);
        urlRefs.current.push(url);
        audioUrls.push(url);
      }

      if (currentRun !== runIdRef.current) return;

      setLoading(false);
      setSpeaking(true);

      for (let i = 0; i < audioUrls.length; i++) {
        if (currentRun !== runIdRef.current) return;

        const audio = new Audio(audioUrls[i]);
        audioRef.current = audio;

        await new Promise((resolve, reject) => {
          audio.onended = resolve;
          audio.onerror = () => reject(new Error("Unable to play audio."));
          audio.play().catch(reject);
        });

        audioRef.current = null;

        if (currentRun !== runIdRef.current) return;

        if (i < audioUrls.length - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, PAUSE_BETWEEN_CHUNKS)
          );

          if (currentRun !== runIdRef.current) return;
        }
      }

      if (currentRun === runIdRef.current) {
        clearAudio();
        setSpeaking(false);
      }
    } catch (err) {
      if (currentRun === runIdRef.current) {
        clearAudio();
        setError(err.message || "Unable to generate speech.");
        setSpeaking(false);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      runIdRef.current += 1;
      clearAudio();
    };
  }, []);

  return { speak, stopSpeech, speaking, loading, error };
}
