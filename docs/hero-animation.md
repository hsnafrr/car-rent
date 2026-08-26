# Part One: the cinematic hero film

This documents the film that drives the hero, how it maps to the four beats,
where it departs from the original brief, and the exact settings needed to
re-render or replace it.

---

## What was delivered

A finished 3D render was supplied as `hero-animations.mp4` and now lives at
`assets-src/hero-master.mp4`.

| Property | Value |
| --- | --- |
| Resolution | 1280x720 |
| Frame rate | 24 fps |
| Frames | 121 |
| Duration | 5.04s |
| Codec | H.264 |
| Audio | None |
| Bitrate | 16.9 Mbps |
| Keyframes | **1**, at frame 0 |
| Burned in text, logos, watermarks | None |

The film was not generated as part of this build. It was reviewed, conformed to
the four beat structure, and re-encoded for the web.

---

## The one thing that had to change

The master carried **a single keyframe for the entire clip**.

A scroll scrubbed hero seeks the video on every scroll frame. With one
keyframe, every seek forces the decoder to walk from frame zero to the target,
which makes scrubbing unusable rather than merely slow.

The web encode is therefore **all intra**: `keyint=1:min-keyint=1:scenecut=0`.
Every frame becomes an independent seek point, so any seek is O(1).

It also got smaller, because the master was heavily over bitrated for its
resolution:

| | Size |
| --- | --- |
| Master, 1 keyframe | 10.6 MB |
| Web encode, 121 keyframes | 3.6 MB |
| Mobile encode | 1.6 MB |

If the film is ever re-rendered, keep the all intra encode. It is the single
technical requirement the hero depends on.

---

## Beat map

121 frames at 24 fps. Scroll progress through the 360svh hero maps linearly
onto the playhead.

### Beat 1: Departure, 0 to 25%, frames 0 to 30, 0.00s to 1.25s

Rear three quarter tracking shot, camera slightly above and behind. The black
Avanza pulls away down a sunken concrete approach ramp in a quiet contemporary
business district. Modern restrained towers and a mountain ridge sit behind.
Late afternoon light, soft and directional. The vehicle accelerates smoothly,
with no drift and no exaggerated speed.

### Beat 2: Boulevard, 25 to 50%, frames 30 to 60, 1.25s to 2.50s

The transition is a **real environmental occlusion**: the car passes into and
out of a concrete tunnel, and the tunnel mouth wipes the frame rather than a
dissolve. It emerges onto an elevated open road, still travelling away from
camera, then the camera swings to a low side tracking position parallel to the
vehicle. Wheel rotation and road contact stay continuous through the change.

### Beat 3: Open journey, 50 to 75%, frames 60 to 90, 2.50s to 3.75s

Low side tracking along a road above a calm lake, with a long bridge and a
mountain range behind. The camera rises and begins a controlled orbit from the
rear side toward the front, opening up the landscape. Time of day, weather, and
direction of travel all hold.

### Beat 4: Arrival, 75 to 100%, frames 90 to 120, 3.75s to 5.04s

The vehicle slows and comes to rest on the stone driveway of a contemporary
hillside villa. The orbit completes to a low front three quarter, headlights
on, sun low over the lake and mountains behind. The front of the vehicle is
fully readable in the final frame, and the left of frame is open for the
headline and the buttons.

**Frame 120 is the site's reduced motion still and the base layer under the
video.** It is also the source of the Open Graph card, taken from frame 118.

---

## Conformance to the brief

### Met

- One continuous journey, consistent direction of travel throughout
- Real environmental occlusion at the beat changes, no dissolves, no teleports
- Late afternoon light developing to a restrained golden hour finish
- Internationally neutral locations, no recognisable Indonesian landmarks
- No road signs, brand signage, or text anywhere in frame
- No occupants and no pedestrians
- Same black Toyota Avanza throughout, consistent body, wheels, grille, glass,
  mirrors, door count, ground clearance, and number plate placement
- Photoreal materials, grounded tyre contact, natural motion blur
- Restrained camera, no shake, no drone wandering, no speed ramps
- No neon, no cyberpunk styling, no oversaturation, no artificial rain
- Clean first and final frames
- 16:9, 24 fps, no audio
- Final frame composed with negative space for copy and CTAs
- Scrubs cleanly forward and backward, verified across the full range

### Departures from the brief

**Resolution is 1280x720, not a 4K master.** Upscaling adds no real detail, so
the web encode is native 720p. On a large desktop display the hero is
noticeably soft. This is the most worthwhile thing to fix.

**Duration is 5.04s, not 10 to 12s.** This matters far less than it sounds.
Playback is driven by scroll position, not by a clock, so the perceived pacing
is set by the 360svh scroll distance rather than by the clip length. The
tradeoff is temporal resolution: 121 frames across 360svh is roughly 15px of
scroll per frame, which reads as smooth. A longer render would give finer
granularity but a larger file.

**Beat 2 is an elevated open road rather than a tree lined boulevard.** The
occlusion transition, the low side tracking angle, and the continuity are all
as briefed; the setting differs.

**Frame by frame vehicle identity was not exhaustively audited.** Nine frames
spread across the four beats were inspected and the vehicle is consistent in
all of them. A full 121 frame review is worth doing before launch if the film
is going to be re-rendered anyway.

---

## Re-render specification

For anyone producing a replacement film.

### Continuity lock

These must not change between frames:

- Body shape and proportions, black metallic paint, front grille, headlights,
  glass, wheels and tyres, mirrors, four passenger doors plus tailgate, ground
  clearance, number plate shape and placement, interior silhouette
- Direction of travel: always forward, never reversed
- Wheel rotation must match ground speed, tyres must not slide or float
- Suspension responds to the road surface
- One sun position per beat, advancing only toward golden hour
- Reflections consistent with the environment actually surrounding the car
- No occupants

### Camera

- FPV stability, no handheld shake
- Never clips through the vehicle
- Restrained depth of field, no rack focus stunts
- Natural motion blur at 180 degree shutter

### Output

| Setting | Value |
| --- | --- |
| Aspect | 16:9 |
| Resolution | 3840x2160 master |
| Frame rate | 24 or 30 fps, constant |
| Duration | 10 to 12s |
| Audio | None |
| Colour | Rec.709 |
| Overlays | None. No text, logo, caption, or watermark |

Deliver the master as ProRes or high bitrate H.264 into
`assets-src/hero-master.mp4`, then run `npm run assets`.

### Do not include

Vehicle morphing or model changes, changing plates, warped wheels, sliding
tyres, floating vehicles, occupants, pedestrians, camera shake, drone
wandering, neon, cyberpunk styling, lens flares, speed ramps, oversaturation,
artificial rain, landmarks, signage, impossible reflections, flickering
shadows, disappearing parts, camera clipping, showroom poses, generic luxury
car commercial framing.

---

## Encode recipes

These are what `tools/build-assets.mjs` runs. Reproduced here so they can be
used directly.

Desktop, all intra:

```bash
ffmpeg -y -i assets-src/hero-master.mp4 -an -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -x264-params "keyint=1:min-keyint=1:scenecut=0" -movflags +faststart public/media/hero-desktop.mp4
```

Mobile, all intra at 854x480:

```bash
ffmpeg -y -i assets-src/hero-master.mp4 -an -vf "scale=854:480:flags=lanczos" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -x264-params "keyint=1:min-keyint=1:scenecut=0" -movflags +faststart public/media/hero-mobile.mp4
```

WebM alternate:

```bash
ffmpeg -y -i assets-src/hero-master.mp4 -an -c:v libvpx-vp9 -crf 42 -b:v 0 -g 1 -keyint_min 1 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p public/media/hero-desktop.webm
```

Verify the keyframe count afterwards. It must equal the frame count:

```bash
ffprobe -v error -select_streams v:0 -show_entries frame=key_frame -of csv=p=0 public/media/hero-desktop.mp4 | grep -c '^1$'
```

Still frames are produced with sharp rather than ffmpeg, because the `-quality`
flag on this ffmpeg build's libwebp encoder is a no op and silently produced
7 KB files that looked badly over compressed. See `buildStills()` in
`tools/build-assets.mjs`.

The six fleet card films are a separate set and are encoded differently: they
play linearly on loop rather than being seeked, so they use a normal GOP and
compress properly. See `ASSETS.md`.
