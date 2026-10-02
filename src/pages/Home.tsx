import "../App.css";
import TitleBar from "../components/TitleBar";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { emitTo } from "@tauri-apps/api/event";
import { useOrb } from "../hooks/useOrb";
import FilePractice from "./FilePractice";

export default function Home() {
  type OrbStatus = "listening" | "processing";

  const { handleVoiceCall, handleToggleShowOrb } = useOrb();
  const appWindow = getCurrentWindow();

  const handleToggleAlwaysOnTop = async () => {
    const current = await appWindow.isAlwaysOnTop();

    await appWindow.setAlwaysOnTop(!current);
  };

  const handleOrbStatusChange = async (typeName: OrbStatus) => {
    await emitTo("orb", "orb-status-changed", typeName);
  };

  return (
    <main className="home-page">
      <TitleBar />

      <div className="home-content">
        <section className="tauri-practice-panel">
          <h1>Tauri 연습</h1>

          <div className="main-container">
            <button onClick={handleToggleAlwaysOnTop}>
              항상 위에 표시 On / Off
            </button>

            <button onClick={handleVoiceCall}>오브 열기</button>

            <button onClick={handleToggleShowOrb}>오브 숨기기 토글</button>

            <button onClick={() => handleOrbStatusChange("listening")}>
              listening
            </button>

            <button onClick={() => handleOrbStatusChange("processing")}>
              processing
            </button>
          </div>
        </section>

        <section className="file-practice-panel">
          <FilePractice />
        </section>
      </div>
    </main>
  );
}
