"use client";
import React, { useState } from "react";

type UploadResult = {
  success: boolean;
  message?: string;
  url?: string;
  expiresAt?: number;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // ブラウザのデフォルト動作を防ぐ
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // ブラウザのデフォルト動作を防ぐ
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drop");
    e.preventDefault(); // ブラウザのデフォルト動作を防ぐ

    console.log(e.dataTransfer);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("expiration", "7");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      const result = (await response.json()) as UploadResult;
      setUploadResult(result);

      if (result.success) {
        setFile(null);
        setFileName("");
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "アップロード中にエラーが発生しました",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>ここにファイルをドラッグ&ドロップしてください</p>
      </div>

      {file && (
        <div>
          <p>ファイル名: {fileName}</p>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "アップロード中..." : "アップロード"}
          </button>
        </div>
      )}

      {uploadResult && uploadResult.success && uploadResult.url && (
        <div>
          <h3>共有URL:</h3>
          <input
            type="text"
            readOnly
            value={uploadResult.url}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={() => navigator.clipboard.writeText(uploadResult.url!)}
          >
            コピー
          </button>

          {uploadResult.expiresAt && (
            <p>有効期限: {new Date(uploadResult.expiresAt).toLocaleString()}</p>
          )}
        </div>
      )}
    </div>
  );
}
