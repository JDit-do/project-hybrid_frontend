"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MainTemplate from "@/shared/ui/templates/MainTemplate";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/molecules/Card";
import {
  Upload,
  Image,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadStatus, setUploadStatus] = useState<{
    [key: string]: "pending" | "uploading" | "success" | "error";
  }>({});

  // Auth check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/onboarding");
    }
  }, [status, router]);

  // const handleLogout = () => {
  //   signOut({ callbackUrl: "/api/auth/logout-redirect" });
  // };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const files = Array.from(e.target.files);
        setUploadedFiles((prev) => [...prev, ...files]);
      }
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const simulateUpload = useCallback((file: File, index: number) => {
    setUploadStatus((prev) => ({ ...prev, [index]: "uploading" }));

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadStatus((prev) => ({ ...prev, [index]: "success" }));
      }
      setUploadProgress((prev) => ({ ...prev, [index]: progress }));
    }, 200);
  }, []);

  const startUpload = useCallback(() => {
    uploadedFiles.forEach((file, index) => {
      simulateUpload(file, index);
    });
  }, [uploadedFiles, simulateUpload]);

  if (status === "loading") {
    return (
      <div className="app-layout__loading">
        <div className="app-layout__spinner" />
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <MainTemplate>
      <div className="upload">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="upload__header"
        >
          <div className="upload__header-content">
            <h1 className="upload__title">
              <Upload className="w-8 h-8" />
              이미지 업로드
            </h1>
            <p className="upload__subtitle">
              드래그 앤 드롭으로 쉽게 이미지를 업로드하세요
            </p>
          </div>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="upload__content"
        >
          <Card className="upload__card">
            <CardContent className="upload__card-content">
              <div
                className={`upload__dropzone ${
                  dragActive ? "upload__dropzone--active" : ""
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="upload__dropzone-content">
                  <div className="upload__dropzone-icon">
                    <Image className="w-16 h-16" width={160} hanging={160} aria-hidden="true" />
                  </div>
                  <h3 className="upload__dropzone-title">
                    이미지를 여기에 드래그하세요
                  </h3>
                  <p className="upload__dropzone-subtitle">
                    또는 클릭하여 파일을 선택하세요
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="upload__file-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="upload__files"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="upload__files-title">
                    <FileText className="w-5 h-5" />
                    선택된 파일 ({uploadedFiles.length}개)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="upload__file-list">
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="upload__file-item"
                      >
                        <div className="upload__file-info">
                          <div className="upload__file-icon">
                            <Image
                              className="w-5 h-5"
                              width={160}
                              hanging={160}
                              aria-hidden="true"
                            />
                          </div>
                          <div className="upload__file-details">
                            <p className="upload__file-name">{file.name}</p>
                            <p className="upload__file-size">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <div className="upload__file-actions">
                          {uploadStatus[index] === "uploading" && (
                            <div className="upload__progress">
                              <div
                                className="upload__progress-bar"
                                style={{
                                  width: `${uploadProgress[index] || 0}%`,
                                }}
                              />
                            </div>
                          )}

                          {uploadStatus[index] === "success" && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}

                          {uploadStatus[index] === "error" && (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}

                          <button
                            onClick={() => removeFile(index)}
                            className="upload__remove-button"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="upload__actions">
                    <button
                      onClick={startUpload}
                      className="upload__upload-button"
                    >
                      <Upload className="w-4 h-4" />
                      업로드 시작
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </MainTemplate>
  );
}
