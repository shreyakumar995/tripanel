"use client";

import { useEffect, useState } from "react";
import {
  getSettings,
  saveSettings,
  TRACK_OPTIONS,
  VOICE_LANGUAGE_OPTIONS,
  type TriPanelSettings,
} from "../lib/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<TriPanelSettings | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  useEffect(() => {
    if (!savedFlash) return;
    const timer = window.setTimeout(() => setSavedFlash(false), 2000);
    return () => window.clearTimeout(timer);
  }, [savedFlash]);

  function updateSettings(patch: Partial<TriPanelSettings>) {
    setSettings((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      saveSettings(next);
      setSavedFlash(true);
      return next;
    });
  }

  if (!settings) {
    return (
      <div className="app-shell flex-1 overflow-y-auto bg-[#F8FAF5]">
        <div className="mx-auto max-w-2xl px-6 py-10">
          <p className="flex items-center gap-2 text-sm text-[#667066]">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#DCE4D8] border-t-[#72D13D]" />
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell flex-1 overflow-y-auto bg-[#F8FAF5]">
      <div className="mx-auto w-full max-w-2xl px-6 py-10 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="landing-eyebrow">Account</p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-[#172018] sm:text-4xl">
              Settings
            </h1>
            <p className="mt-2 text-base text-[#667066]">
              Preferences are saved on this device.
            </p>
          </div>
          {savedFlash && (
            <p className="rounded-full bg-[#E1F3D6] px-3 py-1.5 text-sm font-medium text-[#48B536]">
              Settings saved
            </p>
          )}
        </div>

        <div className="landing-card mt-8 divide-y divide-[#DCE4D8] overflow-hidden">
          <label className="flex cursor-pointer items-center justify-between gap-6 bg-white px-5 py-5 sm:px-6">
            <div>
              <p className="text-base font-medium text-[#172018]">
                Auto-speak questions
              </p>
              <p className="mt-1 text-sm text-[#667066]">
                Read generated questions aloud automatically.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.autoSpeakQuestions}
              onClick={() =>
                updateSettings({
                  autoSpeakQuestions: !settings.autoSpeakQuestions,
                })
              }
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                settings.autoSpeakQuestions ? "bg-[#72D13D]" : "bg-[#DCE4D8]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                  settings.autoSpeakQuestions ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </label>

          <label className="flex flex-col gap-3 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-base font-medium text-[#172018]">Default track</p>
              <p className="mt-1 text-sm text-[#667066]">
                Pre-selected track when you open practice.
              </p>
            </div>
            <select
              value={settings.defaultTrack}
              onChange={(event) =>
                updateSettings({
                  defaultTrack: event.target.value as TriPanelSettings["defaultTrack"],
                })
              }
              className="studio-input w-full px-3 py-2 text-sm sm:w-56"
            >
              {TRACK_OPTIONS.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-3 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-base font-medium text-[#172018]">
                Voice recognition language
              </p>
              <p className="mt-1 text-sm text-[#667066]">
                Language used when speaking your answer.
              </p>
            </div>
            <select
              value={settings.voiceRecognitionLanguage}
              onChange={(event) =>
                updateSettings({
                  voiceRecognitionLanguage: event.target
                    .value as TriPanelSettings["voiceRecognitionLanguage"],
                })
              }
              className="studio-input w-full px-3 py-2 text-sm sm:w-56"
            >
              {VOICE_LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
