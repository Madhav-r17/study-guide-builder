import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import StudyGuidePage from "./pages/StudyGuidePage";
import NotesPage from "./pages/NotesPage";
import FlashcardsPage from "./pages/FlashcardsPage";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/study-guide" element={<StudyGuidePage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/flashcards"
  element={<FlashcardsPage />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;