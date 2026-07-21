/**
 * "Not a technique" intent: complaints about tooling, configuration, or
 * usage mechanics — installing, connecting, keys, quotas, or seeing what a
 * running agent is doing. No thinking technique fixes these, so the
 * classifier routes them to a free 15-minute human consultation instead of
 * pretending a category fits. Vocabulary lives mostly in multi-word phrases:
 * a setup miss falls back to no_match (still helpful), while a stolen
 * technique query would be a wrong answer.
 */

export const CONSULT_PAGE_PATH = "/not-a-technique/";
export const CONSULT_CAL_URL = "https://cal.com/onnson/15min?overlayCalendar=true";

export const SETUP_PROBLEM =
  "I can't see what my agent is doing while it runs in the background — or the tool itself won't install, connect, or stay configured";

export const SETUP_LEXICON: string[] = [
  "install installed installing reinstall setup configure configured configuration config settings",
  "connect connected connecting connection disconnect disconnected endpoint server localhost port offline",
  "logs logging monitor monitoring observability dashboard console terminal tail status visibility",
  "notification notifications notify alerts watch watching background running process",
  "key keys token credential credentials auth authentication login password billing subscription quota version upgrade api",
];

export const SETUP_PHRASES: string[] = [
  "in the background",
  "whats happening",
  "what's happening",
  "what is happening",
  "what it's doing",
  "what its doing",
  "cant see what",
  "can't see what",
  "still running",
  "is it running",
  "how do i install",
  "how to install",
  "how do i set up",
  "how to set up",
  "set it up",
  "api key",
  "rate limit",
  "usage limit",
  "wont connect",
  "won't connect",
  "not connecting",
  "connection refused",
  "mcp server",
  "env var",
  "environment variable",
  "config file",
  "logged out",
  "signed out",
];
