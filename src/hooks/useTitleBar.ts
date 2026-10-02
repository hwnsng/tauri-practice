import { getCurrentWindow } from "@tauri-apps/api/window"

export function useTitleBar() {
  const appWindow = getCurrentWindow();

  const handleMinimize = async () => {
    await appWindow.minimize();
  };
  const handleToggleMaximize = async () => {
    (await appWindow.isMaximized())
      ? appWindow.unmaximize()
      : appWindow.maximize();
  };
  const handleHide = async () => {
    await appWindow.hide();
  };
  return { handleMinimize, handleToggleMaximize, handleHide };
}
