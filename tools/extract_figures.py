#!/usr/bin/env python3
"""Extract the paper's figures from the PDF into static/images/figures/.

The figures are embedded as full-resolution PNGs, so pulling them straight out
beats screenshotting. Re-run this after a paper revision:

    pip install pymupdf pillow
    python3 tools/extract_figures.py

Figures are keyed by (page number, index within page) rather than by PDF xref,
since xrefs shift whenever the document is re-typeset.
"""
import io
import sys
from pathlib import Path

import pymupdf
from PIL import Image

PDF = Path("static/pdfs/_Public_release__MessyMem.pdf")
OUT = Path("static/images/figures")
MAX_W = 1600  # plenty for a 2x retina render at the widths we display
QUALITY = 88  # JPEG: ~74% smaller than PNG here with no visible loss at display size

# (page, index-within-page) -> output stem
FIGURES = {
    (1, 0): "fig1_teaser",
    (4, 0): "fig2_method",
    (9, 0): "fig3_sock_matching",
    (15, 0): "fig4_interaction_analyzer",
    (19, 0): "fig5_retriever",
    (24, 0): "fig6_locked_cabinets",
    (24, 1): "fig7_clutter_pick",
}


def main() -> int:
    if not PDF.exists():
        print(f"error: {PDF} not found (run from the repo root)", file=sys.stderr)
        return 1
    OUT.mkdir(parents=True, exist_ok=True)

    doc = pymupdf.open(PDF)
    written = 0
    for (page_no, idx), stem in sorted(FIGURES.items()):
        images = doc[page_no - 1].get_images(full=True)
        if idx >= len(images):
            print(f"warn: page {page_no} has no image #{idx} - skipping {stem}", file=sys.stderr)
            continue
        raw = doc.extract_image(images[idx][0])
        im = Image.open(io.BytesIO(raw["image"])).convert("RGB")
        if im.width > MAX_W:
            im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
        dest = OUT / f"{stem}.jpg"
        im.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        print(f"{dest}  {im.width}x{im.height}  {dest.stat().st_size // 1024} KB")
        written += 1

    print(f"\n{written}/{len(FIGURES)} figures written to {OUT}/")
    return 0 if written == len(FIGURES) else 1


if __name__ == "__main__":
    raise SystemExit(main())
