export type EmotionOption = {
  id: string;
  label: string;
  uiLine: string;
};

export const EMOTION_TAXONOMY: EmotionOption[] = [
  {
    id: "peace",
    label: "Peace",
    uiLine: "My mind is quiet; I can stay present.",
  },
  {
    id: "anxiety",
    label: "Anxiety",
    uiLine: "The future feels loud and unsettling.",
  },
  {
    id: "weariness",
    label: "Weariness",
    uiLine: "I’ve tried hard; my strength feels low.",
  },
  {
    id: "loneliness",
    label: "Loneliness",
    uiLine: "I feel alone and need connection.",
  },
  {
    id: "hope",
    label: "Hope",
    uiLine: "A small light is there; I can keep going.",
  },
  {
    id: "gratitude",
    label: "Gratitude",
    uiLine: "I can name a reason to be thankful today.",
  },
  {
    id: "grief",
    label: "Grief",
    uiLine: "Loss or disappointment still hurts.",
  },
  {
    id: "confusion",
    label: "Confusion",
    uiLine: "I’m unsure; I need clarity and discernment.",
  },
  {
    id: "joy",
    label: "Joy",
    uiLine: "Quiet joy is rising in me.",
  },
];

export const EMOTION_MEMO_MAX_LENGTH = 160;

export const EMOTION_KEY_SET = new Set(EMOTION_TAXONOMY.map((emotion) => emotion.id));

export const resolveEmotionLabel = (emotionId: string) =>
  EMOTION_TAXONOMY.find((emotion) => emotion.id === emotionId)?.label ?? emotionId;
