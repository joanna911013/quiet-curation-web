"use client";

import { useState, useTransition } from "react";
import { listSaved, normalSave, spoofSave, normalUnsave, spoofUnsave } from "./actions";

export default function SavedRlsClient({ loggedInUserId }: { loggedInUserId: string }) {
  const [pairingId, setPairingId] = useState("");
  const [spoofUserId, setSpoofUserId] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [isPending, startTransition] = useTransition();

  const run = (fn: () => Promise<unknown>) => {
    startTransition(async () => {
      setResult({ running: true });
      const res = await fn();
      setResult(res);
    });
  };

  return (
    <section style={{ marginTop: 16 }}>
      <h2 style={{ fontSize: 16 }}>Inputs</h2>

      <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>
            pairingId (approved pairing id)
          </span>
          <input
            value={pairingId}
            onChange={(e) => setPairingId(e.target.value)}
            placeholder="e.g. 454b1d3e-d016-4e7d-8d94-b2688a6924c8"
            style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>
            spoof userId (User A UUID to spoof as)
          </span>
          <input
            value={spoofUserId}
            onChange={(e) => setSpoofUserId(e.target.value)}
            placeholder="Paste User A UUID here"
            style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
          />
        </label>

        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Current session userId: <code>{loggedInUserId}</code>
        </div>
      </div>

      <h2 style={{ fontSize: 16, marginTop: 18 }}>Actions</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        <button
          disabled={isPending}
          onClick={() => run(() => listSaved())}
          style={btnStyle}
        >
          List saved_items
        </button>

        <button
          disabled={isPending || !pairingId}
          onClick={() => run(() => normalSave(pairingId))}
          style={btnStyle}
        >
          Normal Save (should succeed)
        </button>

        <button
          disabled={isPending || !pairingId || !spoofUserId}
          onClick={() => run(() => spoofSave(spoofUserId, pairingId))}
          style={btnStyleDanger}
        >
          Spoof Save (should FAIL)
        </button>

        <button
          disabled={isPending || !pairingId}
          onClick={() => run(() => normalUnsave(pairingId))}
          style={btnStyle}
        >
          Normal Unsave (should succeed)
        </button>

        <button
          disabled={isPending || !pairingId || !spoofUserId}
          onClick={() => run(() => spoofUnsave(spoofUserId, pairingId))}
          style={btnStyleDanger}
        >
          Spoof Unsave (should FAIL or delete 0)
        </button>
      </div>

      <h2 style={{ fontSize: 16, marginTop: 18 }}>Result</h2>
      <pre
        style={{
          marginTop: 10,
          padding: 12,
          borderRadius: 10,
          background: "#111",
          color: "#fff",
          overflowX: "auto",
          fontSize: 12,
        }}
      >
        {JSON.stringify(result, null, 2)}
      </pre>

      <p style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
        Expected: Spoof Save should return an RLS error (good). If it succeeds, RLS is broken.
      </p>
    </section>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

const btnStyleDanger: React.CSSProperties = {
  ...btnStyle,
  border: "1px solid #ffb4b4",
};
