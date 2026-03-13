import Header from "../components/Header";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,  
  FaCompressAlt,
  FaLock,
  FaSortAmountDown,
  FaEraser,
} from "react-icons/fa";

const services = [
  {
    label: "PDF to Word",
    serviceKey: "pdfToWord",
    fromIcon: <FaFilePdf className="w-6 h-6 text-[#d13837]" />,
    toIcon: <FaFileWord className="w-6 h-6 text-[#4764af]" />,
  },
  {
    label: "JPG to PDF",
    serviceKey: "imageToPdf",
    fromIcon: <FaFileImage className="w-6 h-6 text-[#f59e0b]" />,
    toIcon: <FaFilePdf className="w-6 h-6 text-[#d13837]" />,
  },
  {
    label: "Merge PDF",
    serviceKey: "mergePdf",
    fromIcon: <FaFilePdf className="w-6 h-6 text-[#d13837]" />,
    toIcon: <FaCompressAlt className="w-6 h-6 text-[#832126]" />,
  },
  {
    label: "PDF Security",
    serviceKey: "securityPdf",
    fromIcon: <FaFilePdf className="w-6 h-6 text-[#d13837]" />,
    toIcon: <FaLock className="w-6 h-6 text-green-600" />,
  },
  {
    label: "Rearrange PDF",
    serviceKey: "rearrangePdf",
    fromIcon: <FaFilePdf className="w-6 h-6 text-[#d13837]" />,
    toIcon: <FaSortAmountDown className="w-6 h-6 text-gray-700" />,
  },
  {
    label: "Redact PDF",
    serviceKey: "redactPdf",
    fromIcon: <FaFilePdf className="w-6 h-6 text-[#d13837]" />,
    toIcon: <FaEraser className="w-6 h-6 text-red-700" />,
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-6 flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Popular Services
        </h1>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              fromIcon={service.fromIcon}
              toIcon={service.toIcon}
              label={service.label}
              onClick={() => {
                if(service.serviceKey === "securityPdf"){
                  navigate("/pdf-security");
                }else {
                  navigate(`/upload/${service.serviceKey}`);
                }
              }
              }
            />
          ))}
        </div>
      </main>     

      <Footer />
    </div>
  );
}
