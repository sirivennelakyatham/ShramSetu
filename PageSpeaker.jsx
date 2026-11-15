
import { Volume2, Square, LoaderCircle } from "lucide-react";
import useSpeech from "./useSpeech";
import "./PageSpeaker.css";

export default function PageSpeaker({ language, contentRef }) {
  const { speak, stopSpeech, speaking, loading, error } = useSpeech(language);

  const handleClick = () => {
    if (speaking || loading) {
      stopSpeech();
      return;
    }

    const source =
      contentRef?.current || document.querySelector("main");

    if (!source) return;

    const clone = source.cloneNode(true);

    clone.querySelectorAll(
      "button, input, textarea, select, script, style, nav, " +
      "[aria-hidden='true'], .page-speaker"
    ).forEach((element) => element.remove());

    const text = (clone.innerText || "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!text) return;

    speak(text);
  };

  return (
    <div className="page-speaker">
      <button
        type="button"
        onClick={handleClick}
        aria-label={speaking || loading ? "Stop reading" : "Read this page aloud"}
        title={speaking || loading ? "Stop reading" : "Read this page aloud"}
      >
        {loading ? (
          <LoaderCircle className="speaker-loading" size={21} />
        ) : speaking ? (
          <Square size={20} />
        ) : (
          <Volume2 size={22} />
        )}
        <span>
          {loading ? "Preparing audio..." : speaking ? "Stop" : "Listen"}
        </span>
      </button>

      {error && (
        <span className="page-speaker-error">{error}</span>
      )}
    </div>
  );
}
