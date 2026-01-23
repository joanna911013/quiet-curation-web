export type EmotionOption = {
  id: string;
  label: string;
};

export const EMOTION_TAXONOMY: EmotionOption[] = [
  { id: "peace", label: "Peace" },
  { id: "anxiety", label: "Anxiety" },
  { id: "weariness", label: "Weariness" },
  { id: "loneliness", label: "Loneliness" },
  { id: "hope", label: "Hope" },
  { id: "gratitude", label: "Gratitude" },
  { id: "grief", label: "Grief" },
  { id: "confusion", label: "Confusion" },
  { id: "joy", label: "Joy" },
];

export const EMOTION_MEMO_MAX_LENGTH = 160;

export const EMOTION_KEY_SET = new Set(EMOTION_TAXONOMY.map((emotion) => emotion.id));

export const resolveEmotionLabel = (emotionId: string) =>
  EMOTION_TAXONOMY.find((emotion) => emotion.id === emotionId)?.label ?? emotionId;
