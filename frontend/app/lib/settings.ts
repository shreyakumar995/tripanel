export const TRACK_OPTIONS = [
  "SDE Technical",
  "GenAI",
  "HR Behavioral",
] as const;

export const VOICE_LANGUAGE_OPTIONS = ["en-IN", "en-US", "en-GB"] as const;

export type TrackOption = (typeof TRACK_OPTIONS)[number];
export type VoiceLanguageOption = (typeof VOICE_LANGUAGE_OPTIONS)[number];

export type TriPanelSettings = {
  autoSpeakQuestions: boolean;
  defaultTrack: TrackOption;
  voiceRecognitionLanguage: VoiceLanguageOption;
};

export const DEFAULT_SETTINGS: TriPanelSettings = {
  autoSpeakQuestions: true,
  defaultTrack: "SDE Technical",
  voiceRecognitionLanguage: "en-IN",
};

const STORAGE_KEY = "tripanel_settings";

function isTrackOption(value: unknown): value is TrackOption {
  return TRACK_OPTIONS.includes(value as TrackOption);
}

function isVoiceLanguageOption(value: unknown): value is VoiceLanguageOption {
  return VOICE_LANGUAGE_OPTIONS.includes(value as VoiceLanguageOption);
}

export function getSettings(): TriPanelSettings {
  if (typeof window === "undefined") {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsed = JSON.parse(raw) as Partial<TriPanelSettings>;

    return {
      autoSpeakQuestions:
        typeof parsed.autoSpeakQuestions === "boolean"
          ? parsed.autoSpeakQuestions
          : DEFAULT_SETTINGS.autoSpeakQuestions,
      defaultTrack: isTrackOption(parsed.defaultTrack)
        ? parsed.defaultTrack
        : DEFAULT_SETTINGS.defaultTrack,
      voiceRecognitionLanguage: isVoiceLanguageOption(
        parsed.voiceRecognitionLanguage,
      )
        ? parsed.voiceRecognitionLanguage
        : DEFAULT_SETTINGS.voiceRecognitionLanguage,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: TriPanelSettings): void {
  if (typeof window === "undefined") return;

  const next: TriPanelSettings = {
    autoSpeakQuestions: Boolean(settings.autoSpeakQuestions),
    defaultTrack: isTrackOption(settings.defaultTrack)
      ? settings.defaultTrack
      : DEFAULT_SETTINGS.defaultTrack,
    voiceRecognitionLanguage: isVoiceLanguageOption(
      settings.voiceRecognitionLanguage,
    )
      ? settings.voiceRecognitionLanguage
      : DEFAULT_SETTINGS.voiceRecognitionLanguage,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
