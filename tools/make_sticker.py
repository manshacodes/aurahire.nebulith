"""
make_sticker.py: turn any image (Pinterest memes, reaction pics) into an AuraHire sticker.

Two styles:
  cutout (default): removes the background and adds a white die-cut outline + soft shadow
  card:             keeps the whole image (good for memes with text) as a rounded card with a white border

Usage:
  pip install "rembg[cpu]" pillow
  python3 tools/make_sticker.py input.jpg assets/stickers/name.png
  python3 tools/make_sticker.py meme.png assets/stickers/meme.png --style card
"""

import argparse
from PIL import Image, ImageFilter, ImageDraw, ImageChops

SIZE = 360        # longest side of the final sticker, in px
OUTLINE = 10      # white outline thickness, in px
PAD = 18          # room for the outline and shadow


def cutout(img):
    from rembg import remove, new_session
    session = new_session("u2netp")
    cut = remove(img.convert("RGB"), session=session)
    bbox = cut.getchannel("A").point(lambda a: 255 if a > 20 else 0).getbbox()
    return cut.crop(bbox) if bbox else cut


def fit(img, size):
    img = img.copy()
    img.thumbnail((size, size), Image.LANCZOS)
    return img


def die_cut(subject):
    """White outline that follows the subject's shape, plus a soft drop shadow."""
    w, h = subject.size
    canvas = Image.new("RGBA", (w + PAD * 2, h + PAD * 2), (0, 0, 0, 0))
    alpha = Image.new("L", canvas.size, 0)
    alpha.paste(subject.getchannel("A"), (PAD, PAD))
    alpha = alpha.point(lambda a: 255 if a > 40 else 0)

    outline = alpha.filter(ImageFilter.MaxFilter(OUTLINE * 2 + 1)).filter(ImageFilter.GaussianBlur(1.2))
    shadow = outline.filter(ImageFilter.GaussianBlur(7)).point(lambda a: int(a * 0.35))

    out = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    out.paste((0, 0, 0, 255), (3, 6), shadow)                 # shadow, slightly down-right
    out.paste((255, 255, 255, 255), (0, 0), outline)          # white die-cut border
    out.alpha_composite(subject, (PAD, PAD))                  # the subject on top
    return out


def card(img):
    """Whole image as a rounded card with a thick white border and soft shadow."""
    img = img.convert("RGBA")
    w, h = img.size
    radius = int(min(w, h) * 0.08)
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius, fill=255)
    img.putalpha(ImageChops.multiply(img.getchannel("A"), mask))
    return die_cut(img)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input")
    ap.add_argument("output", help="ends in .png or .webp")
    ap.add_argument("--style", choices=["cutout", "card"], default="cutout")
    args = ap.parse_args()

    src = Image.open(args.input)
    subject = cutout(src) if args.style == "cutout" else src
    subject = fit(subject.convert("RGBA"), SIZE - PAD * 2)
    sticker = die_cut(subject) if args.style == "cutout" else card(subject)
    sticker.save(args.output, quality=90) if args.output.endswith(".webp") else sticker.save(args.output, optimize=True)
    print(f"saved {args.output} ({sticker.size[0]}x{sticker.size[1]})")


if __name__ == "__main__":
    main()
