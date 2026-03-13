import { useParams, Navigate } from "react-router-dom";
import Upload from "./Upload";
import { uploadConfigs } from "../config/uploadConfigs";

export default function UploadPage() {
  const { service } = useParams();
  const config = uploadConfigs[service];

  if (!config) {
    return <Navigate to="/" replace />;
  }

  return <Upload {...config} serviceKey={service} />;
}