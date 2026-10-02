import { getAllWindows, getCurrentWindow } from "@tauri-apps/api/window";
import { emitTo } from "@tauri-apps/api/event";
import { LogicalPosition } from "@tauri-apps/api/dpi";
import { load } from "@tauri-apps/plugin-store";

export function useOrb() {
  const handleVoiceCall = async () => {
    const windows = await getAllWindows();

    const orbWindow = windows.find((window) => window.label === "orb");

    if (orbWindow) {
      await emitTo("orb", "orb-status-changed", "listening");

      await orbWindow.show();
    }
  };
  
  const handleToggleShowOrb = async () => {
    const windows = await getAllWindows();

    const orb = windows.find((window) => window.label === "orb");

    if (!orb) return;

    const visible = await orb.isVisible();

    if (visible) {
      await orb.hide();
    } else {
      await emitTo("orb", "orb-status-changed", "listening");

      await orb.show();
    }
  };

  const handleGetPosition = async () => {
    const windows = getCurrentWindow();

    const position = await windows.outerPosition();
    console.log(position.x);
    console.log(position.y);
  }

  const handleSetPosition = async () => {
    const window = getCurrentWindow();
    
    await window.setPosition(
      new LogicalPosition(100, 100)
    );
  }

  const handleStorePosition = async () => {
    const store = await load('setting.json');
    const windows = getCurrentWindow();
    
    const position = await windows.outerPosition();
    await store.set('x',position.x);
    await store.set('y',position.y);
    await store.save();
    
    let storePosition = await store.get<string>('x');
    console.log(`x : ${storePosition}`);
    storePosition = await store.get<string>("y");
    console.log(`y : ${storePosition}`);
  }

  return { handleVoiceCall, handleToggleShowOrb, handleGetPosition, handleSetPosition, handleStorePosition };
}