#!/usr/bin/env python3
"""公開元URLをHTML・robots.txt・sitemap.xmlへ一括反映する。"""
from pathlib import Path
import sys

PUBLIC = Path(__file__).resolve().parents[1] / "public"
OLD_ORIGIN = "https://kurashi-calc.workers.dev"


def main() -> int:
    if len(sys.argv) != 2 or not sys.argv[1].startswith(("https://", "http://")):
        print("usage: python3 scripts/update_origin.py https://example.com", file=sys.stderr)
        return 2

    new_origin = sys.argv[1].rstrip("/")
    targets = [*PUBLIC.rglob("*.html"), PUBLIC / "robots.txt", PUBLIC / "sitemap.xml"]
    changed = 0
    for path in targets:
        if not path.exists():
            continue
        original = path.read_text(encoding="utf-8")
        updated = original.replace(OLD_ORIGIN, new_origin)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1
    print(f"updated origin in {changed} files: {new_origin}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
