import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import UploadPage from "../pages/UploadPage";
import Result from "../pages/Result";
import Loading from "../pages/Loading";
import Rearrange from "../pages/Rearrange"; // ✅ import Rearrange page
import PdfSecurity from "../pages/PdfSecurity";
import SecurityUpload from "../pages/SecurityUpload";
import RedactPdf from "../pages/RedactPdf";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/redact" element={<RedactPdf/>}/>
        <Route path="/upload/:service" element={<UploadPage />} />
        <Route path="/pdf-security" element={<PdfSecurity />} />
        <Route path="/security/:type" element = {<SecurityUpload/>} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/result" element={<Result />} />
        <Route path="/rearrange" element={<Rearrange />} /> {/* ✅ add route */}
      </Routes>
    </BrowserRouter>
  );
}