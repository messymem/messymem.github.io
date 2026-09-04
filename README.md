# MessyMem — CoRL 2026 project page

Static project page for *MessyMem: Learning-from-Doing Memory for Mobile Manipulation*.

Built on the [Nerfies project page template](https://github.com/nerfies/nerfies.github.io) (Bulma +
bulma-carousel + FontAwesome) — the same template behind
[HoMeR](https://homer-manip.github.io/), [LMP](https://collab.me.vt.edu/lmp/), and
[CHORUS](https://chorus-model.github.io/). No build step, no dependencies: it is plain HTML/CSS/JS.

## View it locally

```bash
./serve.sh          # http://localhost:8000, opens your browser
./serve.sh 8080     # different port
```

Or, straight from VS Code:

- **Live Server** (recommended — auto-reloads on save): install the recommended extension
  (`ritwickdey.LiveServer` — VS Code will offer it when you open this folder), then right-click
  `index.html` → **Open with Live Server**.
- **Task**: `Cmd+Shift+B` runs the *Serve website* task, which is just `./serve.sh`.

Do **not** open `index.html` with `file://` — relative paths and the carousel behave differently there.

## Layout

```
index.html                  the whole page — every section is commented and marked TODO
serve.sh                    local preview server
static/
  css/index.css             your styles (stock Nerfies CSS above the MessyMem override block)
  css/bulma*.css            template vendor CSS — don't edit
  js/index.js               navbar toggle + carousel init
  js/bulma*.js              template vendor JS — don't edit
  images/                   figures; placeholder.svg + favicon.svg live here
  videos/                   rollout mp4s (empty — drop yours in)
  pdfs/messymem_corl2026.pdf  the paper
```

## Filling it in

Search the repo for `TODO` — every spot that needs real content is marked.

1. **Authors & links** — hero section of `index.html`. The paper is anonymized, so the author list is
   placeholder text. Delete link buttons you don't have yet rather than leaving dead `TODO` links.
2. **Figures** — export Figure 1 to `static/images/teaser.png`, Figure 2 to `static/images/method.png`,
   then point the `<img src>` / `<video>` at them. Anything still pointing at `placeholder.svg` shows a
   dashed grey box, so unfilled slots are obvious.
3. **Videos** — drop mp4s at the paths already referenced (`static/videos/teaser.mp4`,
   `real_rollout_1.mp4`, …) and they light up with no HTML edits. Keep them small: H.264, ~720p,
   a few MB each. GitHub Pages has a soft 1 GB repo limit.
   ```bash
   ffmpeg -i raw.mov -vf "scale=1280:-2" -c:v libx264 -crf 26 -preset slow -an static/videos/real_rollout_1.mp4
   ```
4. **Carousel** — in the Real Robot section, duplicate an `.item` block per rollout. Tune
   `slidesToShow` in `static/js/index.js`.
5. **Sections you don't want** — delete the whole `<section>` and its navbar link. Nothing else
   depends on them.
6. **Social preview** — fill the `og:` / `twitter:` meta tags at the top of `index.html` with the
   deployed URL once you have it.

## Color palette

Sampled straight out of the submission PDF (text spans and figure box strokes), so the site matches the
paper exactly. Defined as CSS custom properties at the top of the override block in `static/css/index.css`.

| Property | Color | Variable | Utility class |
|---|---|---|---|
| Globally queryable & spatially grounded | `#a571c8` | `--c-global` | `.p-global` |
| Updatable from interactions | `#45b5a5` | `--c-interaction` | `.p-interaction` |
| Fine-grained | `#f08a6e` | `--c-fine` | `.p-fine` |
| Panel neutral | `#f5f5f5` | `--c-panel` | — |

Wrap any mention of a property in its class and it renders bold + colored, the way the paper does:

```html
It builds a 3D scene graph that is
<span class="p-global">globally queryable &amp; spatially grounded</span>,
<span class="p-interaction">updated through interactions</span>, and
<span class="p-fine">fine-grained</span>.
```

Already applied in the teaser caption, the abstract, the three property cards, the Figure 2 caption, and
the method subsection headings. Use the same classes as you fill in the remaining sections so the color
coding stays consistent.

Two extra variants are available:

- `.p-*-bg` — same bold color plus a soft tinted background, for mentions sitting inside a busy block.
- `--c-global-dark` / `--c-interaction-dark` / `--c-fine-dark` — higher-contrast versions. The paper
  colors are tuned for bold display text; `#f08a6e` in particular is light against white, so if you ever
  put a property color on small or non-bold text, switch that rule to the `-dark` variable.

## Deploying to GitHub Pages

```bash
git init && git add -A && git commit -m "Initial project page"
git branch -M main
git remote add origin git@github.com:<org>/<repo>.git
git push -u origin main
```

Then repo **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.

For a `https://<name>.github.io/` URL (like the reference sites), name the repo `<name>.github.io`.
Otherwise it lands at `https://<org>.github.io/<repo>/` — relative paths already work either way.

## Attribution

Keep the Nerfies credit in the footer; the template is CC BY-SA 4.0.
