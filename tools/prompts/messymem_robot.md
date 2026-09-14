# MessyMem robot illustration

Created with the built-in image-generation tool. The final design omits the laptop and mounts the YAM arm at the front of the base, with the stereo-camera mast at the back.

Reference sources:
- Style: https://messynav.github.io/static/images/favicon-192.png?v=2
- Robot hardware: frames at 2 seconds and 12 seconds from static/videos/t6_sock.mp4.

## Initial generation prompt

Use case: logo-brand.
Create one polished, original robot illustration for the MessyMem research website's favicon and reusable project graphic. Square 1024x1024 canvas with a genuinely transparent alpha background, not a checkerboard or white backdrop.

Reference roles:
1. /tmp/messymem-favicon/messynav-reference.png is a STYLE reference only: match the clean technical-cartoon character, confident dark navy outlines, pale silver surfaces, muted blue-gray shading, three-quarter perspective, and compact robot silhouette. Do not copy its Franka/Panda arm.
2. /tmp/messymem-favicon/tidybot-socks.png is the SUBJECT reference showing the actual TidyBot++ mobile base, YAM arm, laptop and slim camera mast.
3. /tmp/messymem-favicon/tidybot-yam-reaching.png is an additional SUBJECT reference showing the YAM arm's angular silver links and chunky dark joints.

Draw ONLY the actual mobile robot as a clean illustrated cutout, in a slightly elevated front three-quarter view. Its base is a compact open aluminum-extrusion cube on small wheels, with a white/silver flat top deck and dark electronics inside. An open dark laptop sits on the near/front part of the deck. A SINGLE slim 6-DoF YAM arm is mounted on the rear part of the deck: narrow straight silver links, dark charcoal block-like joint housings, gently bent at the elbow, ending in a small black parallel-jaw gripper. A slender dark mast beside the arm supports a small horizontal stereo camera bar. Preserve these real distinguishing features and believable mechanical proportions. Arrange the arm in a relaxed raised pose that makes its silhouette distinct from the mast and laptop. Simplify wiring and internal electronics to a few clean strokes.

Make the robot large and centered, fitting within a square with only about 5% transparent padding around the outermost edges. Use strong outlines and simple legible shapes so it remains identifiable at 32 pixels, while retaining enough detail to reuse as a larger project graphic. Keep the whole base, arm, gripper, wheels and mast visible. No text, letters, branding, watermarks, speech bubbles, background scenery, room objects, people, floor, cast shadow, decorative frame or colored badge. No human-like eyes or head. No bulky white Franka/Panda arm, no extra arm. A true transparent-background robot illustration, not a website mockup or a sprite sheet.

## Laptop removal and transparency edit

Edit the attached robot illustration. Keep the same TidyBot++ aluminum cart, YAM arm shape and exact pose, camera mast position, wheels, perspective, outline style, colors and proportions. Make only these changes:
1. Remove the laptop COMPLETELY, including its screen, keyboard, hinges, and mounting pads. Replace its former area with the clean, continuous white/silver top deck of the robot base. Do not relocate the arm or camera.
2. Remove the gray checkerboard background completely. The finished asset must be an isolated robot on a truly transparent background with a real PNG alpha channel; no painted checkerboard, no white rectangular background and no other backdrop.

This will be the favicon and reusable graphic for a robotics research website. Preserve the full robot silhouette with a little transparent padding on a square canvas. No text or logos. Do not add anything else.

## Front arm placement edit

Edit this transparent robot illustration with one precise mechanical change: move the mounting pedestal of the entire YAM arm from the BACK of the top deck to the FRONT of the base, nearest the viewer. The arm is currently mounted beside the camera near the far/back-right corner of the white deck. Move it onto the currently empty near/front-left portion of the white deck, close to the visible front edge. In the supplied square image, the current arm mounting center is around (780,630); the desired new mounting center is approximately (510,740). Use these only as a spatial guide: preserve convincing perspective and keep the complete robot inside the frame.

Translate the complete arm assembly forward as a unit; preserve its link shapes, joints, elbow bend, gripper and pointing direction. Its pedestal must clearly sit in the front half of the deck, in front of the camera mast. Restore the old mounting area to the clean white/silver top panel. Keep the camera mast in EXACTLY its current back-right position and at the same height. Keep the aluminum base, wheels, electronics, illustration style, palette, perspective, and all other details unchanged. No laptop. No extra arm. No text. Preserve genuine PNG alpha transparency, with no checkerboard or background.

## Final background extraction

Background extraction only. The attached robot design is final and approved. Remove only the gray checkerboard background, including the checkerboard visible through the robot's open-frame gaps, and export the exact robot as a genuinely transparent PNG with an alpha channel. Do not draw a transparency checkerboard into the pixels. Preserve every robot part, its exact front-mounted arm position and pose, rear-right stereo camera placement, colors, outlines, proportions, base, wires and wheels. No laptop. Do not redesign, move, resize, add, or remove any robot feature. The only change must be replacing the checkerboard pixels with transparent alpha.

## Saved assets

- `static/images/messymem_robot.png`: 1024-pixel transparent PNG, compressed below 1 MB.
- `static/images/messymem_robot.webp`: 1254-pixel lossless transparent master, also below 1 MB.
- `static/images/favicon-32.png`: 32-pixel browser favicon.
- `static/images/favicon-192.png`: 192-pixel browser favicon.
- `static/images/apple-touch-icon.png`: 180-pixel touch icon.

Small favicon assets are exported from the full-resolution transparent master with macOS `sips`, preserving alpha. The portable PNG is resized with Lanczos and optimized PNG compression; the full-resolution WebP uses lossless compression.
