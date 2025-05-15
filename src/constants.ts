import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import { SITE } from "@/config";

export const SOCIALS = [
  {
    name: "Github",
    href: "https://github.com/mimikun",
    linkTitle: ` ${SITE.author} on Github`,
    icon: IconGitHub,
  },
  // TODO: it
  {
    name: "Mastodon",
    href: "https://mstdn.mimikun.jp/@mimikun",
    linkTitle: ` ${SITE.author} on Mastodon`,
    icon: IconBrandX,
  },
  // TODO: it
  {
    name: "Bluesky",
    href: "https://bsky.app/profile/mimikun.mimikun.jp",
    linkTitle: ` ${SITE.author} on Bluesky`,
    icon: IconBrandX,
  },
  // TODO: it
  {
    name: "Zenn",
    href: "https://zenn.dev/mimikun",
    linkTitle: `${SITE.author} on Zenn`,
    icon: IconBrandX,
  },
  {
    name: "X",
    href: "https://x.com/mimikun_Dev",
    linkTitle: `${SITE.author} on X`,
    icon: IconBrandX,
  },
] as const;

export const SHARE_LINKS = [
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  // TODO: it
  {
    name: "Mastoshare",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on Mastoshare`,
    icon: IconBrandX,
  },
  // TODO: it
  {
    name: "Misskeyshare",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on Misskeyshare`,
    icon: IconBrandX,
  },
  // TODO: it
  {
    name: "Blueskyshare",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on Blueskyshare`,
    icon: IconBrandX,
  },
] as const;
