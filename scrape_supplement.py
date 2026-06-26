"""Scrape SE directory, mentors, blog, and news from actionforindia.org HTML."""
import json
import re
import urllib.request
from html import unescape
from pathlib import Path

BASE = "https://actionforindia.org/"
ROOT = Path(__file__).parent
JSON_PATH = ROOT / "scraped-data.json"

SECTOR_MAP = {
    "education": "Education",
    "healthcare": "Healthcare",
    "agriculture": "Agriculture",
    "cleanenergy": "Energy",
    "energy": "Energy",
    "livelihoods": "Livelihoods",
    "financial": "Financial Inclusion",
    "other": "Other Tech",
}


def fetch(path: str) -> str:
    url = path if path.startswith("http") else BASE + path.lstrip("/")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 AFI-scraper"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def abs_url(path: str) -> str:
    if not path:
        return ""
    if path.startswith("http"):
        return path
    return BASE + path.lstrip("/")


def strip_tags(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html)
    text = unescape(re.sub(r"\s+", " ", text))
    return text.strip()


def parse_entrepreneurs(html: str) -> list:
    items = []
    for block in re.finditer(
        r'<div class="filterDiv\s+([^"]*)"[^>]*>(.*?)</div>\s*(?=<div class="filterDiv|<div class="col-xs)',
        html,
        re.DOTALL | re.IGNORECASE,
    ):
        classes = block.group(1).lower().split()
        sector_key = next((c for c in classes if c in SECTOR_MAP), "other")
        sector = SECTOR_MAP.get(sector_key, "Other")

        chunk = block.group(2)
        img_m = re.search(r'<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"', chunk, re.I)
        logo_url = abs_url(img_m.group(1)) if img_m else ""
        venture = img_m.group(2).strip() if img_m else ""

        font_m = re.search(r"<font[^>]*>([^<]+)</font>", chunk, re.I)
        name = font_m.group(1).strip() if font_m else venture

        founder_m = re.search(r"Founder:\s*<b>\s*([^<]+)\s*</b>", chunk, re.I)
        founder = founder_m.group(1).strip() if founder_m else ""

        sector_m = re.search(r"Sector:\s*([^<]+)<", chunk, re.I)
        if sector_m:
            sector = strip_tags(sector_m.group(1))

        website_m = re.search(
            r'href="(https?://[^"]+)"[^>]*>(?:https?://)?[^<]+</a>',
            chunk,
            re.I,
        )
        website = ""
        for m in re.finditer(r'href="(https?://[^"]+)"', chunk, re.I):
            url = m.group(1)
            if "linkedin.com" not in url.lower():
                website = url
                break

        linkedin_m = re.search(r'href="(https?://[^"]*linkedin[^"]*)"', chunk, re.I)
        linkedin = linkedin_m.group(1) if linkedin_m else ""

        if name:
            items.append(
                {
                    "name": name,
                    "venture": venture or name,
                    "founder": founder,
                    "sector": sector,
                    "sector_key": sector_key,
                    "website": website,
                    "linkedin": linkedin,
                    "logo_url": logo_url,
                }
            )
    return items


def parse_mentors(html: str) -> list:
    items = []
    for block in re.finditer(
        r'<div class="thumbnail">\s*<figure>\s*<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>\s*</figure>\s*<div class="caption">(.*?)</div>\s*</div>',
        html,
        re.DOTALL | re.I,
    ):
        photo = abs_url(block.group(1))
        alt_name = block.group(2).strip()
        caption = block.group(3)

        h3_m = re.search(r"<h3>([^<]+)</h3>", caption, re.I)
        name = h3_m.group(1).strip() if h3_m else alt_name

        p_m = re.search(r"<p>(.*?)</p>", caption, re.DOTALL | re.I)
        p_html = p_m.group(1) if p_m else ""
        title_lines = []
        location = ""
        for part in re.split(r"<br\s*/?>", p_html, flags=re.I):
            part = strip_tags(part)
            if not part or "linkedin" in part.lower():
                continue
            if re.match(r"^[A-Za-z].*,", part) or part in (
                "California",
                "Mumbai, Maharashtra",
            ):
                location = part
            else:
                title_lines.append(part)
        title = title_lines[0] if title_lines else ""

        linkedin_m = re.search(r'href="(https?://[^"]*linkedin[^"]*)"', caption, re.I)
        linkedin = linkedin_m.group(1) if linkedin_m else ""

        items.append(
            {
                "name": name,
                "title": title,
                "location": location,
                "linkedin": linkedin,
                "photo_url": photo,
            }
        )
    return items


def parse_blogs(html: str) -> list:
    items = []
    for block in re.finditer(
        r'<div class="newsbox">.*?<a href="([^"]+)"[^>]*>.*?<h3>(.*?)</h3>',
        html,
        re.DOTALL | re.I,
    ):
        url = block.group(1)
        title = strip_tags(block.group(2))
        if not title or title.lower() == "afi newsletter":
            continue
        if not url.startswith("http"):
            url = abs_url(url)
        items.append({"title": title, "url": url, "source": "AFI Blog"})
    # Also blog card patterns
    for block in re.finditer(
        r'<div class="box[^"]*">.*?<a href="([^"]+)"[^>]*>.*?<h3>(.*?)</h3>.*?<p>(.*?)</p>',
        html,
        re.DOTALL | re.I,
    ):
        url = block.group(1)
        title = strip_tags(block.group(2))
        excerpt = strip_tags(block.group(3))[:300]
        if not title:
            continue
        if not url.startswith("http"):
            url = abs_url(url)
        entry = {"title": title, "url": url, "excerpt": excerpt, "source": "AFI Blog"}
        if entry not in items and not any(i["title"] == title for i in items):
            items.append(entry)
    return items


def parse_news(html: str) -> list:
    items = []
    seen = set()

    def add(title, url, excerpt="", image="", category="coverage"):
        title = strip_tags(title)
        if not title or len(title) < 5:
            return
        if not url.startswith("http"):
            url = abs_url(url)
        key = title[:80]
        if key in seen:
            return
        seen.add(key)
        if "newsletter" in title.lower() or url.endswith(".pdf") or "newsletter" in url.lower():
            category = "newsletter"
        items.append(
            {
                "title": title,
                "url": url,
                "excerpt": excerpt[:400],
                "category": category,
                "image": abs_url(image) if image else "",
            }
        )

    for block in re.finditer(
        r'<div class="(?:newsbox|box)[^"]*">(.*?)</div>\s*(?=<div class="(?:newsbox|box)|</div>\s*</div>\s*<div class="news)',
        html,
        re.DOTALL | re.I,
    ):
        chunk = block.group(1)
        h3_m = re.search(r"<h3>(.*?)</h3>", chunk, re.DOTALL | re.I)
        if not h3_m:
            continue
        title = h3_m.group(1)
        p_m = re.search(r"<p>(.*?)</p>", chunk, re.DOTALL | re.I)
        excerpt = strip_tags(p_m.group(1)) if p_m else ""
        img_m = re.search(r'<img[^>]+src="([^"]+)"', chunk, re.I)
        image = img_m.group(1) if img_m else ""
        read_m = re.search(r'<a[^>]+href="([^"]+)"[^>]*>\s*Read\s*More', chunk, re.I)
        link_m = re.search(r'<a[^>]+href="([^"]+)"[^>]*target="_blank"', chunk, re.I)
        url = ""
        if read_m:
            url = read_m.group(1).strip()
        elif link_m:
            url = link_m.group(1).strip()
        elif img_m:
            parent_a = re.search(r'<a href="([^"]+)"[^>]*>\s*<img', chunk, re.I)
            if parent_a:
                url = parent_a.group(1)
        add(title, url or "#", excerpt, image)

    return items


def main():
    print("Fetching pages...")
    se_html = fetch("afi-social-entrepreneurs.html")
    mentors_html = fetch("afi-mentors.html")
    blogs_html = fetch("blogs.html")
    news_html = fetch("news-coverage.html")

    entrepreneurs = parse_entrepreneurs(se_html)
    mentors = parse_mentors(mentors_html)
    blogs = parse_blogs(blogs_html)
    news = parse_news(news_html)

    print(f"Entrepreneurs: {len(entrepreneurs)}")
    print(f"Mentors: {len(mentors)}")
    print(f"Blog items: {len(blogs)}")
    print(f"News items: {len(news)}")

    with open(JSON_PATH, encoding="utf-8") as f:
        data = json.load(f)

    data["social_entrepreneurs_directory"] = {
        "intro": data.get("social_entrepreneurs", {}).get("intro", ""),
        "sectors": list(SECTOR_MAP.values()),
        "entrepreneurs": entrepreneurs,
        "scraped_date": "2026-06-25",
        "source": BASE + "afi-social-entrepreneurs.html",
    }
    data["mentors_directory"] = {
        "intro": data.get("mentors_network", {}).get("intro", ""),
        "apply_url": data.get("mentors_network", {}).get("apply_url", ""),
        "mentors": mentors,
        "scraped_date": "2026-06-25",
        "source": BASE + "afi-mentors.html",
    }
    data["blog_archive"] = {
        "posts": blogs,
        "scraped_date": "2026-06-25",
        "source": BASE + "blogs.html",
    }
    data["news_archive"] = {
        "items": news,
        "scraped_date": "2026-06-25",
        "source": BASE + "news-coverage.html",
    }

    # Enrich news_articles for news.html from archive
    if news:
        featured = []
        for i, item in enumerate(news[:20]):
            cat = item.get("category", "coverage")
            tag_map = {"newsletter": "program", "coverage": "recognition"}
            featured.append(
                {
                    "id": f"news-{i}",
                    "category": tag_map.get(cat, "recognition"),
                    "tag": "Newsletter" if cat == "newsletter" else "News",
                    "title": item["title"],
                    "excerpt": item.get("excerpt") or item["title"][:200],
                    "date": "2025",
                    "featured": i < 2,
                    "image": item.get("image") or "https://actionforindia.org/assets/img/AFI-Impact-Cohort-2025.png",
                    "url": item.get("url", ""),
                }
            )
        data["news_articles"] = featured + [
            a for a in data.get("news_articles", []) if a.get("id", "").startswith("forbes")
        ]

    if blogs:
        data["blog_posts"] = [
            {
                "title": b["title"],
                "excerpt": b.get("excerpt", b["title"]),
                "url": b["url"],
                "date": "2025",
            }
            for b in blogs[:30]
        ]

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Updated {JSON_PATH}")


if __name__ == "__main__":
    main()
