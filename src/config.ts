export const SITE = {
  website: "https://mimikun.dev/",
  author: "mimikun",
  profile: "",
  desc: "mimikun's blog",
  title: "mimikun.dev",
  // TODO: it
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 min
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/mimikun/mimikun.dev/edit/master",
  },
  dynamicOgImage: true,
  lang: "ja",
  timezone: "Asia/Tokyo",
} as const;
