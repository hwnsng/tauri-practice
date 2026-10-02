import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import OrbPage from "./pages/OrbPage";

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<OrbPage />} path="/orb" />
      </Routes>
    </BrowserRouter>
  )
}