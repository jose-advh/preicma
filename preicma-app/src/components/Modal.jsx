"use client";
import { useState, useEffect } from "react";
import { animate } from "popmotion";

export default function Modal({ message, type = "info", onClose }) {
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(-30);

  useEffect(() => {
    animate({
      from: { opacity: 0, y: -30 },
      to: { opacity: 1, y: 0 },
      duration: 400,
      onUpdate: (v) => {
        setOpacity(v.opacity);
        setTranslateY(v.y);
      },
    });
  }, []);

  const handleClose = () => {
    animate({
      from: { opacity: 1, y: 0 },
      to: { opacity: 0, y: -30 },
      duration: 400,
      onUpdate: (v) => {
        setOpacity(v.opacity);
        setTranslateY(v.y);
      },
      onComplete: onClose,
    });
  };

  const color =
    type === "error"
      ? "bg-red-500"
      : type === "success"
      ? "bg-green-500"
      : "bg-blue-500";

  return (
    <div
      style={{ opacity, transform: `translateY(${translateY}px)` }}
      className={`${color} fixed top-10 left-1/2 -translate-x-1/2 text-white p-4 px-8 rounded-xl shadow-lg z-50`}
    >
      <div className="flex justify-between items-center gap-4">
        <p className="font-semibold">{message}</p>
        <button
          onClick={handleClose}
          className="font-bold text-white text-xl hover:opacity-80"
        >
          ×
        </button>
      </div>
    </div>
  );
}
