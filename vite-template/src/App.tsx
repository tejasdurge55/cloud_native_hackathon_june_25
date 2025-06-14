import { Route, Routes } from "react-router-dom";

import TextToImagePage from "@/pages/index";


function App() {
  return (
    <Routes>
      <Route element={<TextToImagePage />} path="/" />
    </Routes>
  );
}

export default App;
