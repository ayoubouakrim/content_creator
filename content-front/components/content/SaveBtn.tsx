"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";

export default function SaveBtn({
  onSave,
  label = "Save",
}: {
  onSave: () => Promise<void>;
  label?: string;
}) {
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  const handle = async () => {
    if (saving || ok) return;
    setSaving(true);
    try {
      await onSave();
      setOk(true);
      setTimeout(() => setOk(false), 2000);
    } catch {
      // Error is logged upstream; let the user retry
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handle}
      disabled={saving}
      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide border cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
        ok
          ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
          : saving
            ? "bg-white/5 border-white/10 text-white/20 cursor-not-allowed"
            : "bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10"
      }`}
    >
      {ok ? (
        <Check size={12} strokeWidth={2.5} />
      ) : (
        <Save size={12} strokeWidth={1.75} />
      )}
      {ok ? "Saved" : saving ? "Saving…" : label}
    </button>
  );
}