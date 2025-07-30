# past-diary

Create diary entry files for specified past dates.

## Usage

Specify the dates you want to create diary entries for. Examples:
- "6/20と6/21の日記を作成して"
- "2025-06-15の日記を作成して"
- "昨日と一昨日の日記を作成して"

## Steps

1. **Parse the requested dates from user input**
   - Convert relative dates (昨日, 一昨日) to specific dates
   - Parse various date formats (YYYY-MM-DD, M/D, etc.)
   - Ensure all dates are in the past or today

2. **For each requested date, create the diary file:**
   1. **Get current UTC timestamp** (for article publication metadata): `date -u +"%Y-%m-%dT%H:%M:%S.%3NZ"`
   2. **Determine the day of week in Japanese** for the **requested date** (not current date):
      - Sun: 日
      - Mon: 月
      - Tue: 火
      - Wed: 水
      - Thu: 木
      - Fri: 金
      - Sat: 土
   3. **Create file** at `src/data/blog/YYYY-MM-DD-diary.md` (using the **requested date**)
   4. **Use this exact template** (requested date for title/description, current timestamp for publication):

```markdown
---
pubDatetime: [current UTC timestamp - NOT the requested date]
modDatetime: [current UTC timestamp - NOT the requested date]
title: [YYYY年M月D日(曜日)の日記]
featured: false
draft: false
tags:
  - diary
description:
  [YYYY年M月D日の日記です。]
---

## Table of contents

## はじめに

この記事は**一部**AIが書いています

## やったこと

## やりたいこと
```

## Important Notes

### Date Usage Rules
- **pubDatetime/modDatetime**: Use CURRENT timestamp (when creating the file)
  - This ensures proper chronological ordering in the blog
  - Shows when the diary entry was actually written/published
- **File name**: Use REQUESTED date (e.g., 2025-06-20-diary.md for June 20th)
- **Title/description**: Use REQUESTED date (the day being documented)

### Content Requirements
- The "はじめに" section MUST contain "この記事は**一部**AIが書いています"
- Create multiple files if multiple dates are requested
- Leave the content sections empty (just the headers)

### Key Point
**DO NOT create today's diary** - only create files for the specific dates requested by the user. The current timestamp is only used for publication metadata, not for determining which diary to create.

