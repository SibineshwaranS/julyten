import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import IntroLoader from "./components/IntroLoader";
import PasswordPage from "./pages/PasswordPage";
import HeroPage from "./pages/HeroPage";
import LoveQuotePage from "./pages/LoveQuotePage";
import MemoryPage from "./pages/MemoryPage";
import GalleryPage from "./pages/GalleryPage";
import GiftPage from "./pages/GiftPage";
import LetterPage from "./pages/LetterPage";
import CakePage from "./pages/CakePage";
import GamePage from "./pages/GamePage";
import EndingPage from "./pages/EndingPage";
import EndPage from "./pages/EndPage";


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {

  const [loading, setLoading] = useState(true);

  const [unlocked, setUnlocked] = useState(
    localStorage.getItem("unlocked") === "true"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <IntroLoader />;
  }

  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* Password */}
        <Route
          path="/"
          element={
            unlocked ? (
              <Navigate to="/hero" />
            ) : (
              <PasswordPage onUnlock={setUnlocked} />
            )
          }
        />

        {/* Hero */}
        <Route
          path="/hero"
          element={
            unlocked ? (
              <HeroPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Love Quote */}
        <Route
          path="/love-quote"
          element={
            unlocked ? (
              <LoveQuotePage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Memory */}
        <Route
          path="/memories"
          element={
            unlocked ? (
              <MemoryPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Gallery */}
        <Route
          path="/gallery"
          element={
            unlocked ? (
              <GalleryPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/gift" element={ unlocked ? ( <GiftPage /> ) : ( <Navigate to="/" /> ) } />
        <Route path="/letter" element={unlocked ? <LetterPage /> : <Navigate to="/" />} />
        <Route path="/cake" element={unlocked ? <CakePage /> : <Navigate to="/" />} />
        <Route path="/game" element={unlocked ? <GamePage /> : <Navigate to="/" />} />
        <Route path="/final" element={unlocked ? <EndingPage /> : <Navigate to="/" />} />
        <Route path="/end" element={unlocked ? <EndPage /> : <Navigate to="/" />} />

      </Routes>
    </>
  );
}

export default App;