import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const webRoot = fileURLToPath(new URL('../../web/src/', import.meta.url));
const read = (relative: string) => readFileSync(join(webRoot, relative), 'utf8');
const resource = (language: string) => JSON.parse(read(`i18n/resources.${language}.json`)) as Record<string, string>;
const sourceFiles = (directory: string): string[] => readdirSync(directory).flatMap(name => {
  const path = join(directory, name);
  return statSync(path).isDirectory() ? sourceFiles(path) : path.endsWith('.tsx') ? [path] : [];
});

test('DE, UK and RU translation resources have identical complete key sets', () => {
  const de = resource('de'), uk = resource('uk'), ru = resource('ru');
  assert.deepEqual(Object.keys(uk).sort(), Object.keys(de).sort());
  assert.deepEqual(Object.keys(ru).sort(), Object.keys(de).sort());
  for (const [key, value] of Object.entries(de)) assert.ok(value.trim(), `empty DE translation: ${key}`);
  const sources = sourceFiles(webRoot).map(path => readFileSync(path, 'utf8')).join('\n');
  const literalKeys = [...sources.matchAll(/\bt\(['"]([^'"]+)['"]/g)].map(match => match[1]);
  for (const key of literalKeys) assert.ok(de[key], `missing literal translation key: ${key}`);
  for (const status of ['NEW','AUDITED','CONTACTED','REPLY','CALL','OFFER','FOLLOW-UP','WON','LOST']) assert.ok(de[`status.${status}`]);
  for (const status of ['DRAFT','READY','DIALING','IN_PROGRESS','COMPLETED','FAILED','CANCELLED']) assert.ok(de[`callStatus.${status}`]);
});

test('mobile lead cards, progressive creation, call preparation and import UI are present', () => {
  const leads = read('pages/Leads.tsx');
  assert.match(leads, /mobile-lead-list/);
  assert.match(leads, /lead\.stepBasic/);
  assert.match(leads, /actions\.savePrepare/);
  assert.match(leads, /\/api\/call-tasks/);
  const dataManagement = read('pages/DataManagement.tsx');
  assert.match(dataManagement, /\/api\/clients\/import/);
  assert.match(dataManagement, /accept="\.json,\.csv/);
  const detail = read('pages/ClientDetail.tsx');
  assert.match(detail, /sections\.lastFeedback/);
  assert.match(detail, /feedback-grid/);
  assert.match(detail, /id="emma"/);
});

test('client detail shows a collapsible localized transcript with status, speakers and disclaimer', () => {
  const detail = read('pages/ClientDetail.tsx');
  const styles = read('styles/global.ts');
  assert.match(detail, /transcript\.title/);
  assert.match(detail, /transcript\.segments\.map/);
  assert.match(detail, /transcript\.notice/);
  assert.match(detail, /transcriptTime/);
  assert.match(styles, /\.transcript-turn/);
  for (const language of ['de', 'uk', 'ru']) {
    const translations = resource(language);
    for (const key of ['transcript.title', 'transcript.customer', 'transcript.emma', 'transcript.partial', 'transcript.final', 'transcript.notice', 'transcript.empty']) {
      assert.equal(typeof translations[key], 'string');
      assert.ok(translations[key].length > 0);
    }
  }
});

test('mobile shell uses dedicated bottom navigation and responsive safe-area styles', () => {
  assert.match(read('App.tsx'), /<MobileNav\/>/);
  const navigation = read('components/layout/MobileNav.tsx');
  for (const route of ['/', '/leads', '/calls', '/messages', '/settings']) assert.ok(navigation.includes(`to="${route}"`));
  const styles = read('styles/global.ts');
  assert.match(styles, /@media\(max-width:900px\)/);
  assert.match(styles, /env\(safe-area-inset-bottom\)/);
  assert.match(styles, /\.desktop-only\{display:none/);
});

test('Obsidian Glass tokens, gold hierarchy, motion restraint and mobile transcript layout are shared', () => {
  const theme = read('styles/theme.ts');
  const global = read('styles/global.ts');
  const card = read('components/ui/Card.tsx');
  assert.match(theme, /bg:'#050505'/);
  assert.match(theme, /accent:'#e5c477'/);
  assert.match(theme, /cardStrong/);
  assert.match(card, /backdrop-filter:blur/);
  assert.match(global, /repeating-radial-gradient/);
  assert.match(global, /prefers-reduced-motion/);
  assert.match(global, /@media\(max-width:560px\)\{\.transcript-turn\{max-width:100%/);
});

test('every normal Emma launch sends an exact CallTask ID', () => {
  for (const page of ['pages/Leads.tsx', 'pages/Calls.tsx', 'pages/ClientDetail.tsx']) {
    const source = read(page);
    assert.match(source, /callTaskId/);
    assert.match(source, /voice-agent\/handoff/);
  }
});

test('Emma launch configuration failures use localized operator messages', () => {
  const launchHelper = read('voiceAgentLaunch.ts');
  assert.match(launchHelper, /voice_agent_app_not_configured/);
  assert.match(launchHelper, /voiceAgent\.productionNotConfigured/);
  assert.match(launchHelper, /voiceAgent\.unavailable/);
  for (const page of ['pages/Leads.tsx', 'pages/Calls.tsx', 'pages/ClientDetail.tsx']) {
    assert.match(read(page), /voiceAgentLaunchError/);
  }
});
