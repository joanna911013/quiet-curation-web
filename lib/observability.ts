type LogPayload = Record<string, unknown>;

type LogLevel = "info" | "warn" | "error";

const getEnvName = () =>
  process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown";

const emit = (level: LogLevel, event: string, payload: LogPayload) => {
  const entry = {
    ts: new Date().toISOString(),
    env: getEnvName(),
    level,
    event,
    ...payload,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
};

export const logInfo = (event: string, payload: LogPayload = {}) => {
  emit("info", event, payload);
};

export const logWarn = (event: string, payload: LogPayload = {}) => {
  emit("warn", event, payload);
};

export const logError = (
  event: string,
  payload: LogPayload = {},
  error?: unknown,
) => {
  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : undefined;
  const derived =
    errorMessage ? truncateText(errorMessage, 200) : undefined;
  emit("error", event, {
    ...payload,
    ...(derived ? { error_message: derived } : {}),
  });
};

export const maskEmail = (email: string | null | undefined) => {
  if (!email) return null;
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) {
    return `${local[0] ?? ""}***@${domain}`;
  }
  return `${local.slice(0, 2)}***@${domain}`;
};

export const truncateText = (value: string, max = 200) =>
  value.length > max ? `${value.slice(0, max)}…` : value;
