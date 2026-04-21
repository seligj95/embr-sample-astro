/** @jsxImportSource preact */
import { useState } from "preact/hooks";

export default function HydrationCanary() {
  const [n, setN] = useState(0);
  return (
    <button
      onClick={() => setN((x) => x + 1)}
      style={{
        background: "#3a7bd5",
        color: "white",
        border: 0,
        borderRadius: 6,
        padding: "0.5rem 1rem",
        cursor: "pointer",
        fontSize: "1rem",
      }}
    >
      Clicks: {n}
    </button>
  );
}
