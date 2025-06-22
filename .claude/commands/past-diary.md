# past-diary

Create diary entry files for specified past dates.

## Usage

Specify the dates you want to create diary entries for. Examples:
- "6/20と6/21の日記を作成して"
- "2025-06-15の日記を作成して"
- "昨日と一昨日の日記を作成して"

## Steps

1. Parse the requested dates from user input
2. For each date:
   1. Get current UTC timestamp using: `date -u +"%Y-%m-%dT%H:%M:%S.%3NZ"`
   2. Determine the day of week in Japanese for the requested date:
      - Sun: 日
      - Mon: 月
      - Tue: 火
      - Wed: 水
      - Thu: 木
      - Fri: 金
      - Sat: 土
   3. Create file at `src/data/blog/YYYY-MM-DD-diary.md` (using the requested date)
   4. Use this exact template:

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

## Important

- Use the CURRENT timestamp for both pubDatetime and modDatetime (NOT the diary date)
- The file name should use the REQUESTED date (e.g., 2025-06-20-diary.md for June 20th)
- The title and description should use the REQUESTED date
- The "はじめに" section MUST contain "この記事は**一部**AIが書いています"
- Create multiple files if multiple dates are requested
- Leave the content sections empty (just the headers)