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
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-2xl px-6 py-10">
          <p className="text-sm text-text-muted">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-2xl px-6 py-10 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-ivory sm:text-4xl">
              Settings
            </h1>
            <p className="mt-2 text-base text-text-muted">
              Preferences are saved on this device.
            </p>
          </div>
          {savedFlash && (
            <p className="rounded-full bg-accent/15 px-3 py-1.5 text-sm font-medium text-accent">
              Settings saved
            </p>
          )}
        </div>

        <div className="mt-8 space-y-0 divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface">
          <label className="flex cursor-pointer items-center justify-between gap-6 px-5 py-5 sm:px-6">
            <div>
              <p className="text-base font-medium text-ivory">
                Auto-speak questions
              </p>
              <p className="mt-1 text-sm text-text-muted">
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
                settings.autoSpeakQuestions ? "bg-accent" : "bg-border-subtle"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-background transition-transform ${
                  settings.autoSpeakQuestions ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </label>

          <label className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-base font-medium text-ivory">Default track</p>
              <p className="mt-1 text-sm text-text-muted">
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
              className="w-full rounded-md border border-border-subtle bg-background px-3 py-2 text-sm text-ivory outline-none focus:border-accent/40 sm:w-56"
            >
              {TRACK_OPTIONS.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-base font-medium text-ivory">
                Voice recognition language
              </p>
              <p className="mt-1 text-sm text-text-muted">
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
              className="w-full rounded-md border border-border-subtle bg-background px-3 py-2 text-sm text-ivory outline-none focus:border-accent/40 sm:w-56"
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
