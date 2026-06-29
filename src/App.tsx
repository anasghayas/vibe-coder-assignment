import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}

export default App;
