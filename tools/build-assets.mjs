/**
 * Morfosa Transport asset pipeline.
 *
 * Rebuilds every web asset in public/ from the masters in assets-src/.
 * Requires ffmpeg on PATH. Run with: npm run assets
 *
 * The single most important detail here is the all-intra encode of the hero
 * video. The delivered master carries one keyframe for the whole clip, which
 * makes scroll scrubbing unusable because every seek has to decode from frame
 * zero. Re-encoding with keyint=1 makes every frame an independent seek point,
 * and it also shrinks the file because the master was heavily over bitrated.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const SRC = path.join(root, 'assets-src');
const MEDIA = path.join(root, 'public', 'media');
const FLEET = path.join(root, 'public', 'fleet');
const TMP = path.join(root, '.asset-tmp');

const HERO_MASTER = path.join(SRC, 'hero-master.mp4');
const LOGO = path.join(root, 'public', 'logo.png');

/**
 * Fleet card films. One studio turntable per vehicle, keyed by the slug used in
 * src/data/fleet.ts. These play linearly on loop rather than being scrubbed, so
 * unlike the hero they use a normal GOP and compress properly.
 */
const FLEET_VIDEOS = {
  'agya-brio': 'brio.mp4',
  'avanza-xenia': 'avanza.mp4',
  'innova-reborn': 'innova.mp4',
  'hiace-commuter': 'commuter.mp4',
  'hiace-premio': 'premio.mp4',
  'grandmax-blindvan': 'grandmax.mp4',
};

/**
 * The supplied logo is a square lockup on its own dark navy bed: monogram on
 * top, then the wordmark, then "ESTABLISHED 2008". The bed is fully opaque,
 * there is no transparency to work with, so the mark is cropped out for the
 * header and the whole lockup is kept for the footer. Measured from the gold
 * bounding box: the mark occupies y 66 to 339 and the type starts at y 375.
 */
const LOGO_MARK_CROP = { left: 155, top: 44, width: 322, height: 322 };

/** Frame indices in the master. The clip is 121 frames at 24fps. */
const FIRST_FRAME = 0;
const FINAL_FRAME = 120;
const OG_FRAME = 118;

const ff = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: 'inherit' });
const kb = (p) => `${(statSync(p).size / 1024).toFixed(0)} KB`;

function ensureDirs() {
  for (const d of [MEDIA, FLEET, TMP]) mkdirSync(d, { recursive: true });
}

function requireMasters() {
  for (const f of [HERO_MASTER]) {
    if (!existsSync(f)) {
      throw new Error(`Missing master asset: ${path.relative(root, f)}`);
    }
  }
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  } catch {
    throw new Error('ffmpeg is required on PATH to rebuild assets.');
  }
}

function buildVideo() {
  console.log('\nHero video');

  // Desktop master. All-intra so currentTime seeks are instant under scrub.
  ff([
    '-i', HERO_MASTER, '-an',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p',
    '-x264-params', 'keyint=1:min-keyint=1:scenecut=0',
    '-movflags', '+faststart',
    path.join(MEDIA, 'hero-desktop.mp4'),
  ]);
  console.log('  hero-desktop.mp4       ', kb(path.join(MEDIA, 'hero-desktop.mp4')));

  // Mobile. Smaller frame, same all-intra guarantee.
  ff([
    '-i', HERO_MASTER, '-an', '-vf', 'scale=854:480:flags=lanczos',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-pix_fmt', 'yuv420p',
    '-x264-params', 'keyint=1:min-keyint=1:scenecut=0',
    '-movflags', '+faststart',
    path.join(MEDIA, 'hero-mobile.mp4'),
  ]);
  console.log('  hero-mobile.mp4        ', kb(path.join(MEDIA, 'hero-mobile.mp4')));

  // WebM alternate. Listed second in the video element, so browsers that can
  // play H.264 never download it. VP9 all-intra is larger than x264 all-intra
  // at matched quality, which is why it is not the primary source.
  ff([
    '-i', HERO_MASTER, '-an',
    '-c:v', 'libvpx-vp9', '-crf', '42', '-b:v', '0',
    '-g', '1', '-keyint_min', '1', '-row-mt', '1',
    '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p',
    path.join(MEDIA, 'hero-desktop.webm'),
  ]);
  console.log('  hero-desktop.webm      ', kb(path.join(MEDIA, 'hero-desktop.webm')));
}

/** Pull a single frame out of the master as lossless PNG for sharp to finish. */
function extractFrame(frameIndex, outName) {
  const out = path.join(TMP, outName);
  ff(['-i', HERO_MASTER, '-vf', `select=eq(n\\,${frameIndex})`, '-frames:v', '1', '-c:v', 'png', out]);
  return out;
}

async function buildStills() {
  console.log('\nHero stills');

  const firstPng = extractFrame(FIRST_FRAME, 'first.png');
  const finalPng = extractFrame(FINAL_FRAME, 'final.png');
  const ogPng = extractFrame(OG_FRAME, 'og.png');

  // Poster shown while the video loads.
  await sharp(firstPng).webp({ quality: 80, effort: 6 }).toFile(path.join(MEDIA, 'hero-poster.webp'));
  await sharp(firstPng).avif({ quality: 55, effort: 6 }).toFile(path.join(MEDIA, 'hero-poster.avif'));

  // Final frame. Doubles as the reduced-motion still because it is the frame
  // composed to leave negative space for the headline and CTAs.
  await sharp(finalPng).webp({ quality: 82, effort: 6 }).toFile(path.join(MEDIA, 'hero-final.webp'));
  await sharp(finalPng).avif({ quality: 58, effort: 6 }).toFile(path.join(MEDIA, 'hero-final.avif'));
  await sharp(finalPng).resize(854, 480, { fit: 'cover' }).webp({ quality: 76, effort: 6 })
    .toFile(path.join(MEDIA, 'hero-final-mobile.webp'));
  await sharp(finalPng).resize(854, 480, { fit: 'cover' }).avif({ quality: 52, effort: 6 })
    .toFile(path.join(MEDIA, 'hero-final-mobile.avif'));

  // Open Graph card.
  await sharp(ogPng).resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(MEDIA, 'og-cover.jpg'));

  const built = ['hero-poster.webp', 'hero-poster.avif', 'hero-final.webp', 'hero-final.avif',
    'hero-final-mobile.webp', 'hero-final-mobile.avif', 'og-cover.jpg'];
  for (const f of built) console.log(`  ${f.padEnd(23)}`, kb(path.join(MEDIA, f)));
}

async function buildFleetVideos() {
  console.log('\nFleet cards');

  for (const [slug, file] of Object.entries(FLEET_VIDEOS)) {
    const source = path.join(SRC, file);
    if (!existsSync(source)) {
      console.log(`  ${slug.padEnd(20)} SKIPPED, ${file} not found`);
      continue;
    }

    // Desktop, native 1088x832. Audio is stripped: these are decorative loops
    // and the page never plays sound.
    ff([
      '-i', source, '-an',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-pix_fmt', 'yuv420p',
      '-g', '48', '-movflags', '+faststart',
      path.join(FLEET, `${slug}.mp4`),
    ]);

    // Mobile. scale=640:-2 keeps the aspect and forces an even height.
    ff([
      '-i', source, '-an', '-vf', 'scale=640:-2:flags=lanczos',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '32', '-pix_fmt', 'yuv420p',
      '-g', '48', '-movflags', '+faststart',
      path.join(FLEET, `${slug}-mobile.mp4`),
    ]);

    // Poster. Also the reduced motion still, so it must read on its own.
    const framePng = path.join(TMP, `${slug}-frame.png`);
    ff(['-i', source, '-vf', 'select=eq(n\\,0)', '-frames:v', '1', '-c:v', 'png', framePng]);
    await sharp(framePng).webp({ quality: 80, effort: 6 }).toFile(path.join(FLEET, `${slug}.webp`));
    await sharp(framePng).avif({ quality: 55, effort: 6 }).toFile(path.join(FLEET, `${slug}.avif`));

    const sizes = ['mp4', 'webp', 'avif']
      .map((ext) => `${ext} ${kb(path.join(FLEET, `${slug}.${ext}`))}`)
      .join(', ');
    console.log(`  ${slug.padEnd(20)} ${sizes}, mobile ${kb(path.join(FLEET, `${slug}-mobile.mp4`))}`);
  }
}

async function buildLogo() {
  console.log('\nLogo');
  if (!existsSync(LOGO)) {
    console.log('  SKIPPED, public/logo.png not found');
    return;
  }

  // Header mark. Square tile, cropped above the wordmark.
  for (const size of [96, 192]) {
    const suffix = size === 96 ? '' : '@2x';
    await sharp(LOGO)
      .extract(LOGO_MARK_CROP)
      .resize(size, size)
      .webp({ quality: 90, effort: 6 })
      .toFile(path.join(root, 'public', `logo-mark${suffix}.webp`));
  }

  // Footer lockup. The full supplied artwork, just compressed.
  for (const width of [320, 640]) {
    const suffix = width === 320 ? '' : '@2x';
    await sharp(LOGO)
      .resize({ width })
      .webp({ quality: 86, effort: 6 })
      .toFile(path.join(root, 'public', `logo-lockup${suffix}.webp`));
  }

  for (const f of ['logo-mark.webp', 'logo-mark@2x.webp', 'logo-lockup.webp', 'logo-lockup@2x.webp']) {
    console.log(`  ${f.padEnd(22)}`, kb(path.join(root, 'public', f)));
  }
}

async function buildIcons() {
  console.log('\nIcons');
  // Wordmark glyph: an M cut out of the carbon brand square. Drawn as SVG so it
  // stays crisp and needs no external artwork.
  // Derived from the real logo mark so the browser tab matches the brand.
  const source = existsSync(LOGO)
    ? sharp(LOGO).extract(LOGO_MARK_CROP)
    : sharp(Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">' +
        '<rect width="512" height="512" fill="#101109"/></svg>'
      ));
  const square = await source.resize(512, 512).png().toBuffer();
  await sharp(square).resize(512, 512).png().toFile(path.join(root, 'public', 'icon-512.png'));
  await sharp(square).resize(180, 180).png().toFile(path.join(root, 'public', 'apple-icon.png'));
  await sharp(square).resize(32, 32).png().toFile(path.join(root, 'public', 'favicon.png'));
  console.log('  icon-512.png / apple-icon.png / favicon.png');
}

async function main() {
  requireMasters();
  ensureDirs();
  buildVideo();
  await buildStills();
  await buildFleetVideos();
  await buildLogo();
  await buildIcons();
  rmSync(TMP, { recursive: true, force: true });
  console.log('\nAssets rebuilt.\n');
}

main().catch((err) => {
  console.error(`\nAsset build failed: ${err.message}\n`);
  process.exitCode = 1;
});
