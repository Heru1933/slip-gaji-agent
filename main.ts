// Entry program for the bring-the-humans-03 TikTok ad bounty.
//
// What this entry is: a short vertical video ad for make.fun, posted
// publicly on TikTok. The repository's only job at grading time is to hand
// the video's address to the house, so this program reads VIDEO.json from
// the repository root, checks that the address it carries really looks like
// a TikTok video address, and copies the file into the output directory.
//
// Local run, standing in for the grader's /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const videoFile = join(botDir, 'VIDEO.json');

// A full TikTok video address: the @name, then /video/, then the numeric id
// (TikTok ids run long — well over ten digits). Short share links are refused
// by the house, so they are refused here too, and so is any address carrying
// a query string: the house reads the bare address it is given.
const TIKTOK_VIDEO = /^https:\/\/(www\.|m\.)?tiktok\.com\/@[^/]+\/video\/\d{10,}\/?$/;

let parsed: { url?: unknown };
try {
  parsed = JSON.parse(readFileSync(videoFile, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json is missing or unreadable at ${videoFile}: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof parsed.url !== 'string' || !TIKTOK_VIDEO.test(parsed.url)) {
  console.error('VIDEO.json must hold {"url": "https://www.tiktok.com/@<name>/video/<id>"} with the full address, not a short link.');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(videoFile, join(outputDir, 'VIDEO.json'));
