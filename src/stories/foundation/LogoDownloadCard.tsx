type LogoDownloadCardProps = {
  src: string;
  filename: string;
  alt: string;
  className?: string;
};

async function downloadAsset(src: string, filename: string) {
  const response = await fetch(src);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function LogoDownloadCard({
  src,
  filename,
  alt,
  className = "",
}: LogoDownloadCardProps) {
  return (
    <div className={`lb-logo-card ${className}`.trim()}>
      <img src={src} alt={alt} />
      <button
        type="button"
        className="lb-download-btn"
        onClick={() => downloadAsset(src, filename)}
      >
        <svg
          className="lb-download-icon"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 3v7M8 10 5.5 7.5M8 10l2.5-2.5M4 13h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Download
      </button>
    </div>
  );
}
