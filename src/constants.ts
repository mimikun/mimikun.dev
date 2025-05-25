import IconSimpleGitHub from "@/assets/icons/IconSimpleGitHub.svg";
import IconSimpleX from "@/assets/icons/IconSimpleX.svg";
import IconSimpleBluesky from "@/assets/icons/IconSimpleBluesky.svg";
import IconSimpleMastodon from "@/assets/icons/IconSimpleMastodon.svg";
//import IconSimpleMisskey from "@/assets/icons/IconSimpleMisskey.svg";
import IconSimpleZenn from "@/assets/icons/IconSimpleZenn.svg";
//import IconSimpleHatebu from "@/assets/icons/IconSimpleHatebu.svg";

import { SITE } from "@/config";

export const SOCIALS = [
  {
    name: "Github",
    href: "https://github.com/mimikun",
    linkTitle: ` ${SITE.author} on Github`,
    icon: IconSimpleGitHub,
  },
  {
    name: "Mastodon",
    href: "https://mstdn.mimikun.jp/@mimikun",
    linkTitle: ` ${SITE.author} on Mastodon`,
    icon: IconSimpleMastodon,
  },
  {
    name: "Bluesky",
    href: "https://bsky.app/profile/mimikun.mimikun.jp",
    linkTitle: ` ${SITE.author} on Bluesky`,
    icon: IconSimpleBluesky,
  },
  {
    name: "Zenn",
    href: "https://zenn.dev/mimikun",
    linkTitle: `${SITE.author} on Zenn`,
    icon: IconSimpleZenn,
  },
  {
    name: "X",
    href: "https://x.com/mimikun_Dev",
    linkTitle: `${SITE.author} on X`,
    icon: IconSimpleX,
  },
] as const;

export const SHARE_LINKS = [
  // TODO: it
  /*
  {
    name: "Mastoshare",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on Mastoshare`,
    icon: IconSimpleMastodon,
  },
  // TODO: it
  {
    name: "Misskeyshare",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on Misskeyshare`,
    icon: IconSimpleMisskey,
  },
  // TODO: it
  {
    name: "Blueskyshare",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on Blueskyshare`,
    icon: IconSimpleBluesky,
  },
  */
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconSimpleX,
  },
  // TODO: it
  /*
  {
    name: "Hatebu",
    href: "https://b.hatena.ne.jp/entry/panel/?url=",
    linkTitle: `Share this post on Hatebu`,
    icon: IconSimpleHatebu,
  },
  */
] as const;
