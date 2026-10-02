import "../App.css";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { useOrb } from "../hooks/useOrb";

export default function OrbPage() {
  const { handleGetPosition, handleSetPosition, handleStorePosition } = useOrb();
  type OrbStatus = "listening" | "processing";
  const [status, setStatus] = useState<OrbStatus>("listening");
  
  useEffect(() => {
    const setupListener = async () => {
      const unlisten = await listen<OrbStatus>(
        "orb-status-changed",
        (event) => {
          setStatus(event.payload);
        },
      );

      return unlisten;
    };

    let unlisten: (() => void) | undefined;

    setupListener().then((fn) => {
      unlisten = fn;
    });

    return () => {
      unlisten?.();
    };
  }, []);

  return (
    <div className="orb-page">
      <div className="orb-circle" data-tauri-drag-region>
        <button onClick={handleGetPosition}>좌표 찍기</button>
        <button onClick={handleSetPosition}>좌표 변경</button>
        <button onClick={handleStorePosition}>좌표 저장</button>
        {status === "listening" && <div>듣기 모드</div>}

        {status === "processing" && <div>작업 모드</div>}
      </div>
    </div>
  );
}