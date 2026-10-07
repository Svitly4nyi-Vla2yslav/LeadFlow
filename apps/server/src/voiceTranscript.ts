import { createHash } from 'node:crypto';
import { z } from 'zod';
import type { CallTranscript } from './db/memory';

export const TRANSCRIPT_LIMITS = {
  maxSegments: 2_000,
  maxSegmentCharacters: 4_000,
  maxAggregateCharacters: 250_000,
  maxDurationMs: 24 * 60 * 60 * 1_000
} as const;

const isoTimestamp = z.string().datetime({ offset: true }).transform(value => new Date(value).toISOString());
const exactIdentifier = z.string().min(1).max(200).refine(value => value === value.trim(), 'Identifier must be exact');
const reference = z.object({ leadId: exactIdentifier }).strict();
const callTaskReference = z.object({ callTaskId: exactIdentifier }).strict();
const transcriptText = z.string()
  .max(TRANSCRIPT_LIMITS.maxSegmentCharacters)
  .refine(value => value.trim().length > 0, 'Transcript segment text cannot be empty');

// segmentSchema перевіряє один потоковий фрагмент і відхиляє часовий інтервал, у якому кінець передує початку.
const segmentSchema = z.object({
  sequence: z.number().int().nonnegative(),
  speaker: z.enum(['CUSTOMER', 'EMMA']),
  text: transcriptText,
  startMs: z.number().int().nonnegative().max(TRANSCRIPT_LIMITS.maxDurationMs).optional(),
  endMs: z.number().int().nonnegative().max(TRANSCRIPT_LIMITS.maxDurationMs).optional()
}).strict().superRefine((segment, context) => {
  if (segment.startMs !== undefined && segment.endMs !== undefined && segment.endMs < segment.startMs) {
    context.addIssue({ code: 'custom', path: ['endMs'], message: 'endMs must not be before startMs' });
  }
});

// VoiceAgentTranscriptV1Schema перевіряє повну подію: часові межі, сумарний обсяг тексту та строго зростаючу послідовність сегментів.
export const VoiceAgentTranscriptV1Schema = z.object({
  contractVersion: z.literal('1.0'),
  eventId: z.string().uuid().transform(value => value.toLowerCase()),
  conversationId: z.string().uuid().transform(value => value.toLowerCase()),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  state: z.enum(['PARTIAL', 'FINAL']),
  leadRef: reference,
  callTaskRef: callTaskReference,
  startedAt: isoTimestamp,
  endedAt: isoTimestamp.optional(),
  segments: z.array(segmentSchema).min(1).max(TRANSCRIPT_LIMITS.maxSegments)
}).strict().superRefine((value, context) => {
  if (value.endedAt && Date.parse(value.endedAt) < Date.parse(value.startedAt)) {
    context.addIssue({ code: 'custom', path: ['endedAt'], message: 'endedAt must not be before startedAt' });
  }
  if (value.endedAt && Date.parse(value.endedAt) - Date.parse(value.startedAt) > TRANSCRIPT_LIMITS.maxDurationMs) {
    context.addIssue({ code: 'custom', path: ['endedAt'], message: 'Transcript duration exceeds the limit' });
  }
  const aggregateCharacters = value.segments.reduce((total, segment) => total + segment.text.length, 0);
  if (aggregateCharacters > TRANSCRIPT_LIMITS.maxAggregateCharacters) {
    context.addIssue({ code: 'custom', path: ['segments'], message: 'Aggregate transcript text exceeds the limit' });
  }
  for (let index = 1; index < value.segments.length; index += 1) {
    if (value.segments[index].sequence <= value.segments[index - 1].sequence) {
      context.addIssue({ code: 'custom', path: ['segments', index, 'sequence'], message: 'Segment sequence must be strictly increasing' });
      break;
    }
  }
});

export type VoiceAgentTranscriptV1 = z.infer<typeof VoiceAgentTranscriptV1Schema>;

type TranscriptSegment = VoiceAgentTranscriptV1['segments'][number];

// joinTranscriptText з’єднує сусідні фрагменти без зайвого пробілу біля пунктуації; аргументи не змінюються.
const joinTranscriptText = (left: string, right: string): string => {
  if (!left) return right.trimStart();
  if (!right) return left;
  if (/\s$/u.test(left) || /^\s/u.test(right)) return `${left}${right}`;
  if (/^[,.;:!?%)\]}]/u.test(right) || /[(\[{â€žâ€œ"']$/u.test(left)) return `${left}${right}`;
  return `${left} ${right}`;
};

// hasMeaningfulPause повертає true для паузи від 1,2 с або від 0,5 с після завершеного речення, якщо часові мітки доступні.
const hasMeaningfulPause = (previous: TranscriptSegment, current: TranscriptSegment): boolean => {
  if (previous.endMs === undefined || current.startMs === undefined) return false;
  const pause = current.startMs - previous.endMs;
  return pause >= 1_200 || (pause >= 500 && /[.!?â€¦][â€"']?\s*$/u.test(previous.text));
};

// compactTranscriptSegments приймає потокові фрагменти, об’єднує суміжну мову одного спікера та повертає перенумеровані репліки для CRM.
// Нова репліка починається при зміні спікера або змістовній паузі; вхідний масив не змінюється.
export const compactTranscriptSegments = (segments: TranscriptSegment[]): TranscriptSegment[] => {
  const turns: TranscriptSegment[] = [];
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const previousRaw = segments[index - 1];
    const previousTurn = turns[turns.length - 1];
    if (!previousTurn || previousTurn.speaker !== segment.speaker || (previousRaw && hasMeaningfulPause(previousRaw, segment))) {
      turns.push({ ...segment, sequence: turns.length, text: segment.text.trim() });
      continue;
    }
    previousTurn.text = joinTranscriptText(previousTurn.text, segment.text).trim();
    if (segment.endMs !== undefined) previousTurn.endMs = segment.endMs;
  }
  return turns.filter(turn => turn.text.length > 0).map((turn, sequence) => ({ ...turn, sequence }));
};

// transcriptFromEvent перетворює перевірену подію на CallTranscript, обчислює тривалість для завершеного дзвінка й фіксує updatedAt.
export const transcriptFromEvent = (event: VoiceAgentTranscriptV1, updatedAt = new Date().toISOString()): CallTranscript => ({
  version: '1.0',
  conversationId: event.conversationId,
  state: event.state,
  revision: event.revision,
  startedAt: event.startedAt,
  ...(event.endedAt ? {
    endedAt: event.endedAt,
    durationMs: Date.parse(event.endedAt) - Date.parse(event.startedAt)
  } : {}),
  segments: compactTranscriptSegments(event.segments),
  updatedAt
});

// comparableTranscript відкидає службове updatedAt, щоб однаковий зміст мав однаковий контрольний хеш.
const comparableTranscript = (transcript: CallTranscript) => ({
  version: transcript.version,
  conversationId: transcript.conversationId,
  state: transcript.state,
  revision: transcript.revision,
  startedAt: transcript.startedAt,
  endedAt: transcript.endedAt,
  durationMs: transcript.durationMs,
  segments: transcript.segments
});

// transcriptContentHash повертає SHA-256 канонічного вмісту транскрипту для виявлення повторів без зовнішніх побічних ефектів.
export const transcriptContentHash = (transcript: CallTranscript) => createHash('sha256')
  .update(JSON.stringify(comparableTranscript(transcript)))
  .digest('hex');
