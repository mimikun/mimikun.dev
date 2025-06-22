# today-diary

Create a diary entry file for today's date.

## Steps

1. Get current UTC timestamp using: `date -u +"%Y-%m-%dT%H:%M:%S.%3NZ"`
2. Determine the day of week in Japanese:
   - Sun: 日
   - Mon: 月
   - Tue: 火
   - Wed: 水
   - Thu: 木
   - Fri: 金
   - Sat: 土
3. Create file at `src/data/blog/YYYY-MM-DD-diary.md`
4. Use this exact template:

```markdown
---
pubDatetime: [current UTC timestamp]
modDatetime: [current UTC timestamp]
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

- 

## やりたいこと

- 
```

## Important

- Use the current timestamp for both pubDatetime and modDatetime
- The "はじめに" section MUST contain "この記事は**一部**AIが書いています"
- Do NOT use "この記事は人間が書いています"
