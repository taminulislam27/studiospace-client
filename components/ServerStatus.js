"use client";

import { useEffect, useState } from "react";

// Phase 0 deploy check: confirms the /backend rewrite reaches the Express server.
export default function ServerStatus() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    fetch("/backend/")
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then(() => setStatus("online"))
      .catch(() => setStatus("offline"));
  }, []);

  const badge =
    status === "online"
      ? "badge-success"
      : status === "offline"
        ? "badge-error"
        : "badge-warning";

  return (
    <div className="flex items-center gap-2">
      <span>API server:</span>
      <span className={`badge ${badge}`}>{status}</span>
    </div>
  );
}
