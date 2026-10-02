import { useTitleBar } from "../hooks/useTitleBar";

export default function TitleBar(){
  const { handleHide, handleMinimize, handleToggleMaximize } = useTitleBar();

  return(
    <div style={{"display": "flex", "justifyContent":"space-between"}}>
      <div className="drag-area" data-tauri-drag-region>
        <span>Tauri Practice</span>
      </div>
      <div className="title-bar">
        <button onClick={handleMinimize}>_</button>
        <button onClick={handleToggleMaximize}>▢</button>
        <button onClick={handleHide}>X</button>
      </div>
    </div>
  )
}
