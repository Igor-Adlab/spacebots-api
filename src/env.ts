import { bool, cleanEnv, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  // Dev vars
  DISABLE_BOTS: bool({ default: false }),

  AXIOS_PROXY: str({ default: '' }),

  SUPPORT_USERNAME: str(),

  // Common settings
  API_HOST: str(),
  REDIS_URL: str(),
  DATABASE_URL: str(),
  OPENAI_API_KEY: str(),
  BEARER_AUTH_TOKEN: str(),

  GOOGLE_CLOUD_REGION: str(),
  GOOGLE_CLOUD_PROJECT: str(),

  // Storage settings
  GCP_BUCKET: str(),
  RUN_GCP_STORAGE_CLEANER: bool({ default: false }),

  // Billing bot settings
  BILLING_BOT_TOKEN: str(),
  BILLING_BOT_SECRET: str(),
  BILLING_BOT_USERNAME: str(),
  BILLING_BOT_DONATION_AMOUNT: num({ default: 25 }),
  BILLING_BOT_SUBSCRIPTION_PRICE: num({ default: 50 }),

  // Downloader bot settings
  DOWNLOADER_BOT_TOKEN: str(),
  DOWNLOADER_BOT_SECRET: str(),
  DOWNLOADER_BOT_USERNAME: str(),
  DOWNLOADER_BOT_RAPIDAPI_KEY: str(),
  DOWNLOADER_BOT_RAPIDAPI_DOWNLOADER_URL: str(),
  DOWNLOADER_BOT_FREE_DAILY_LIMIT: num({ default: 3 }),

  // Music search bot settings
  MUSIC_SEARCH_BOT_TOKEN: str(),
  MUSIC_SEARCH_BOT_SECRET: str(),
  MUSIC_SEARCH_BOT_USERNAME: str(),
  MUSIC_SEARCH_BOT_PAGE_SIZE: num({ default: 5 }),
  MUSIC_SEARCH_BOT_RESULT_COLUMNS: num({ default: 1 }),
  MUSIC_SEARCH_BOT_FREE_DAILY_LIMIT: num({ default: 3 }),
  MUSIC_SEARCH_BOT_ZM_FM_API_URL: str({ default: 'https://zmfm.tgbot.space' }),

  // TikTok videos bot settings
  TIKTOK_VIDEOS_BOT_TOKEN: str(),
  TIKTOK_VIDEOS_BOT_SECRET: str(),
  TIKTOK_VIDEOS_BOT_USERNAME: str(),
  TIKTOK_VIDEOS_BOT_PRICE_PER_MINUTE: num({ default: 7 }),
  TIKTOK_VIDEOS_BOT_FREE_DAILY_LIMIT: num({ default: 3 }),

  TIKTOK_VIDEOS_BOT_STORAGE_HOST: str({ default: 'storage.googleapis.com' }),

  TIKTOK_VIDEOS_BOT_MAX_AUDIO_DURATION_MIN: num({ default: 5 }),
  TIKTOK_VIDEOS_BOT_MAX_VIDEO_DURATION_MIN: num({ default: 5 }),
  TIKTOK_VIDEOS_BOT_MAX_ROLLS_DURATION_SEC: num({ default: 10 }),

  // Video captions bot
  VIDEO_CAPTIONS_BOT_TOKEN: str(),
  VIDEO_CAPTIONS_BOT_SECRET: str(),
  VIDEO_CAPTIONS_BOT_USERNAME: str(),

  // Video to text bot
  VIDEO_TO_TEXT_BOT_TOKEN: str(),
  VIDEO_TO_TEXT_BOT_SECRET: str(),
  VIDEO_TO_TEXT_BOT_USERNAME: str(),
  VIDEO_TO_TEXT_BOT_FREE_DAILY_LIMIT: num({ default: 3 }),
});
