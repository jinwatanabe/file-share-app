"use client";

function FileDownloadClient({ fileId }: { fileId: string }) {
  const handdleDownload = () => {
    window.location.href = `/api/download/${fileId}`;
  };

  return (
    <div>
      <button onClick={handdleDownload}>ファイルをダウンロード</button>
    </div>
  );
}

export default FileDownloadClient;
