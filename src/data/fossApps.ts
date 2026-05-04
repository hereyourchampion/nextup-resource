export interface FossApp {
  name: string;
  author: string;
  url: string;
  tags: string[];
  recommendedBy?: string;
}

const gh = (path: string, tags: string[] = ["Android"], recommendedBy?: string): FossApp => {
  const [author, name] = path.split("/");
  return {
    name,
    author,
    url: `https://github.com/${path}`,
    tags,
    recommendedBy,
  };
};

export const fossApps: FossApp[] = [
  // Source list
  {
    name: "AndroidFossApps (Source List)",
    author: "F3FFO",
    url: "https://github.com/F3FFO/AndroidFossApps/blob/main/APPlast",
    tags: ["Android", "List"],
  },

  // Standard Android apps
  gh("reveny/Android-Habit-Tracker"),
  gh("sidhant947/wallet"),
  gh("Marco-9456/AniSync"),
  gh("Dking08/croc-app"),
  gh("thrillfall/OeffiSounds"),
  gh("isotjs/todosian-app"),
  gh("Rve27/RvSystem-Monitor"),
  gh("rama-io/mako"),
  gh("mistermo-vibecode/VoicePlus"),
  gh("LuckyTheCookie/FitTrack"),
  gh("refda/reloado_auth"),
  gh("Kenneth-Cho-InfoSec/Open100x"),
  gh("jqssun/android-mac-editor"),
  gh("CraftWorksMC/Chora"),
  gh("ohuc/CaffeineHealth"),
  gh("ebraminio/bouncy"),
  gh("itsfaraz/Setwork"),
  gh("stianthaulow/scrib"),
  gh("hddq/restoid"),
  gh("michael-betz/OpenVine"),
  gh("abhay-byte/mkm"),
  gh("cvc953/localplayer"),
  gh("abhay-byte/fluxlinux"),
  gh("hxreborn/discover-ads-filter"),

  // WhisperPair set
  {
    name: "WhisperPair (Website)",
    author: "whisperpair.eu",
    url: "https://whisperpair.eu",
    tags: ["Android", "Website"],
  },
  gh("SpectrixDev/DIY_WhisperPair"),
  gh("zalexdev/wpair-app"),

  gh("AkuaTech/ksupatcher"),
  gh("Benojir/Android-Call-Recorder"),
  gh("simondankelmann/Bluetooth-LE-Spam"),
  gh("WeiguangTWK/Mercurygram-NH"),

  // Root apps
  gh("Astoritin/BloatVeil", ["Android", "Root"]),
  gh("Enginex0/zeromount", ["Android", "Root"]),
  gh("Enginex0/Scalpel", ["Android", "Root"]),
  gh("Enginex0/UsbMassStorage", ["Android", "Root"]),
  gh("Elcapitanoe/Build-Prop-BETA", ["Android", "Root"]),
  {
    name: "PixelProp",
    author: "pixelprop.pages.dev",
    url: "https://pixelprop.pages.dev",
    tags: ["Android", "Root", "Website"],
  },
  gh("HanSoBored/Zygisk-Loader", ["Android", "Root"]),
  gh("Astoritin/Targeter", ["Android", "Root"]),
  gh("nullcpy/rvb", ["Android", "Root"]),

  // More
  gh("SanmerApps/ColorPicker"),
  gh("PaulWoitaschek/Voice"),
  gh("shub39/Rush"),
  gh("keymapperorg/KeyMapper"),

  // Andrax / pentesting
  {
    name: "ANDRAX (Website)",
    author: "andraxsnakesecurity",
    url: "https://andraxsnakesecurity.github.io/andrax",
    tags: ["Android", "Root", "Pentesting", "Website"],
  },
  {
    name: "Snake Security",
    author: "snake-security",
    url: "https://gitlab.com/snake-security",
    tags: ["Android", "Root", "Pentesting", "GitLab"],
  },

  gh("mariinkys/OpenPillReminder"),
  gh("sunstep/dawarich-android"),
  gh("francescobonesi/Date-a-base"),
  gh("dietrichmax/colota"),
  gh("digital-grease/fauxx"),
  gh("blocoio/snowflake"),
  gh("Koukobin/Ermis"),
  gh("Jaimies/SkillApp"),
  gh("CollotsSpot/Ensemble"),
  gh("boldtrn/graphhopper-maps-capacitor"),
  gh("ReSo7200/InstaEclipse", ["Android", "Root"]),

  // Aryan's recommendations
  gh("woheller69/audio-analyzer-for-android", ["Android"], "Aryanski"),
  gh("mafik/echo", ["Android"], "Aryanski"),
  gh("PranshulGG/RecordMaster", ["Android"], "Aryanski"),
  gh("PRosenb/AdbClipboard", ["Android"], "Aryanski"),
];
