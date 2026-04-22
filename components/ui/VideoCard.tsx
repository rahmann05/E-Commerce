"use client";

interface VideoCardProps {
  src: string;
  className?: string;
}

export default function VideoCard({ src, className = "" }: VideoCardProps) {
  return (
    <div className={`bento-card ${className}`}>
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
