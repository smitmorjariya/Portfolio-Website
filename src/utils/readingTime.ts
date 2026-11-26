export interface ReadingTimeEstimate {
  words: number;
  minutes: number;
  seconds: number;
  label: string;
  ariaLabel: string;
}

export const DEFAULT_WORDS_PER_MINUTE = 200;

export type TextSource = string | readonly (string | readonly string[])[];

function flattenTextSources(source: TextSource): string {
  if (typeof source === 'string') {
    return source;
  }
  return source
    .map((item) => (typeof item === 'string' ? item : item.join(' ')))
    .join(' ');
}

/**
 * Counts meaningful words across a string or nested string arrays.
 */
export function countWords(source: TextSource): number {
  const combined = flattenTextSources(source).trim();
  if (!combined) return 0;

  return combined
    .split(/\s+/)
    .filter((token) => /[A-Za-z0-9]/.test(token)).length;
}

/**
 * Estimates reading time for long-form content sections at a comfortable
 * technical reading pace (default 200 WPM).
 */
export function estimateReadingTime(
  source: TextSource,
  wordsPerMinute = DEFAULT_WORDS_PER_MINUTE,
): ReadingTimeEstimate {
  const safeWpm = wordsPerMinute > 0 ? wordsPerMinute : DEFAULT_WORDS_PER_MINUTE;
  const words = countWords(source);

  if (words === 0) {
    return {
      words: 0,
      minutes: 0,
      seconds: 0,
      label: '< 1 min read',
      ariaLabel: 'Estimated reading time: under 1 minute',
    };
  }

  const seconds = Math.round((words / safeWpm) * 60);

  if (seconds < 30) {
    return {
      words,
      minutes: 0,
      seconds,
      label: '< 1 min read',
      ariaLabel: 'Estimated reading time: under 1 minute',
    };
  }

  const minutes = Math.max(1, Math.ceil(words / safeWpm));
  const unit = minutes === 1 ? 'minute' : 'minutes';

  return {
    words,
    minutes,
    seconds,
    label: `${minutes} min read`,
    ariaLabel: `Estimated reading time: ${minutes} ${unit}`,
  };
}
