export type TelegramBotAccent = "primary" | "secondary" | "tertiary";

export type TelegramBot = {
  name: string;
  desc: string;
  url: string;
  tag: string;
  category: string;
  accent: TelegramBotAccent;
  dateAdded?: string;
};

// Default add-date used when a bot doesn't have its own. Newer bots specify
// a `dateAdded` directly so "Newest first" sorting and the What's New inbox
// can surface the most recent additions.
const ADDED = "2026-06-01";

// Alphabetical by name. `category` drives grouping on the Telegram Tweaks page
// and the global search index. Keep this list in sync with telegram-bots.json.
const RAW: (Omit<TelegramBot, "dateAdded"> & { dateAdded?: string })[] = [
  {
    name: "Alpha Whale",
    desc:
      "Trading bot native to Telegram. Set up copy-trading strategies and explore Polymarket tools in minutes.",
    url: "https://app.alphawhale.trade/",
    tag: "Trading · Polymarket",
    category: "Trading",
    accent: "tertiary",
  },
  {
    name: "AvaBot",
    desc:
      "An AI-powered personal assistant that answers your questions, helps with tasks, and keeps things conversational.",
    url: "https://t.me/spy16_avabot",
    tag: "AI Assistant",
    category: "AI & Assistants",
    accent: "primary",
  },
  {
    name: "BotFather",
    desc:
      "The official Telegram bot for creating and managing your own bots. Set commands, descriptions, and API tokens.",
    url: "https://t.me/botfather",
    tag: "Official · Bot Dev",
    category: "Bot Dev & Community",
    accent: "tertiary",
  },
  {
    name: "Classical Music",
    desc: "Find beautiful and masterpiece classical music inside Telegram.",
    url: "https://t.me/music",
    tag: "Classical",
    category: "Music",
    accent: "secondary",
  },
  {
    name: "Eddy Flights",
    desc:
      "Chat with the Eddy Travels AI assistant and discover the best flight deals in seconds.",
    url: "https://t.me/EddyTravels_bot",
    tag: "Travel · AI",
    category: "AI & Assistants",
    accent: "secondary",
  },
  {
    name: "Fitsman",
    desc:
      "Grab PC games straight from FitGirl Repacks — search, browse, and download right inside Telegram.",
    url: "https://t.me/Fitsman_bot",
    tag: "PC Games · FitGirl",
    category: "Downloaders",
    accent: "primary",
  },
  {
    name: "Flbob",
    desc:
      "Send any file to the bot and receive an end-to-end encrypted link only you and your friends can open.",
    url: "https://t.me/fblob_bot",
    tag: "Encrypted Sharing",
    category: "File Tools",
    accent: "tertiary",
  },
  {
    name: "Group Help Bot",
    desc:
      "Powerful group management bot for Telegram — moderation, welcomes, rules, anti-spam and more.",
    url: "https://t.me/GroupHelpBot",
    tag: "Group Management",
    category: "Bot Dev & Community",
    accent: "primary",
  },
  {
    name: "Insta Saver",
    desc: "Download Instagram reels and posts using this fast Instagram downloader bot.",
    url: "https://t.me/instaflix_bot",
    tag: "Instagram",
    category: "Downloaders",
    accent: "secondary",
  },
  {
    name: "Insta Thread Download",
    desc: "Download any Threads post natively from Telegram.",
    url: "https://t.me/instaThreadsBot",
    tag: "Threads",
    category: "Downloaders",
    accent: "tertiary",
  },
  {
    name: "New File Converter",
    desc:
      "Convert files from one format to another easily — works with images, audio files, and videos.",
    url: "https://t.me/newfileconverterbot",
    tag: "Converter",
    category: "File Tools",
    accent: "primary",
  },
  {
    name: "Nextup File Bot",
    desc:
      "Store and share files of any size with a private cloud-style link. Handy for backups and quick transfers.",
    url: "https://t.me/nextupfilebot",
    tag: "File Storage",
    category: "File Tools",
    accent: "secondary",
  },
  {
    name: "Sukoon Music Bot",
    desc:
      "Search and stream music directly inside Telegram. A clean, no-fuss bot for when you just want to hit play.",
    url: "https://t.me/sukoon_music_bot",
    tag: "Music",
    category: "Music",
    accent: "primary",
  },
  {
    name: "TikTok Downloader",
    desc:
      "Download TikTok videos cleanly — no watermark, no hassle. Just paste the link and get the file.",
    url: "https://t.me/downloader_tiktok_bot",
    tag: "TikTok",
    category: "Downloaders",
    accent: "secondary",
  },
  {
    name: "Translation Chatbot",
    desc:
      "Translate all chat messages to other languages. Add the bot to any group and start translating instantly.",
    url: "https://t.me/TranslationChatBot",
    tag: "Translation",
    category: "AI & Assistants",
    accent: "tertiary",
  },
  {
    name: "Video To Gif Converter",
    desc: "Convert videos into Telegram GIFs while preserving their original quality.",
    url: "https://t.me/VideoToGifConverterBot",
    tag: "Video · GIF",
    category: "File Tools",
    accent: "secondary",
  },
  {
    name: "Vkm Bot",
    desc: "Send an artist and/or song name and the bot will find the music for you.",
    url: "https://t.me/vkmusbot",
    tag: "Search · Music",
    category: "Music",
    accent: "tertiary",
  },
  {
    name: "WonderVerse Bot",
    desc:
      "End-to-end community management for Telegram, Discord, YouTube, Twitter and Snapshot. Free 5-minute setup.",
    url: "https://wonderverse.com/?utm_source=telegrambotlist",
    tag: "Community",
    category: "Bot Dev & Community",
    accent: "secondary",
  },
  {
    name: "Ysaver Bot",
    desc:
      "Download YouTube videos and audio for free. Supports time-coded segments via start/end timestamps.",
    url: "https://t.me/savefast_bot",
    tag: "YouTube",
    category: "Downloaders",
    accent: "tertiary",
  },
  {
    name: "YT to MP3",
    desc:
      "Extract audio/MP3 from any YouTube video using the link. Free and fast YouTube to MP3 conversion.",
    url: "https://t.me/youtubetomp3dl_bot",
    tag: "YouTube · MP3",
    category: "Downloaders",
    accent: "primary",
  },
];

export const telegramBots: TelegramBot[] = RAW.map((b) => ({ ...b, dateAdded: ADDED }));

export const telegramBotCategories = Array.from(
  new Set(telegramBots.map((b) => b.category)),
).sort();
