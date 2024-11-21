import { camelCase, isNil } from 'lodash';
import { I18n } from '@grammyjs/i18n';
import { has } from 'lodash';
import { resolve } from 'path';
import { IBotCommonCtx, ISessionDataWithLocalization } from './bots/shared';
import { env } from './env';
import { assignDefaults } from './bots/tiktok-videos/constants';

export type LanguageCode = 'uk' | 'ru' | 'en';
export const i18n = new I18n<IBotCommonCtx<ISessionDataWithLocalization>>({
  useSession: false,
  defaultLocale: 'ru',
  directory: resolve(__dirname, './assets/locales'),
  localeNegotiator: (ctx) => {
    if (!!ctx.preCheckoutQuery || isNil(ctx.session)) {
      return ctx.from?.language_code ?? 'en';
    }

    return ctx.session.__language_code ?? ctx.from?.language_code;
  },
  globalTranslationContext: (ctx) => {
    if (!!ctx.preCheckoutQuery || isNil(ctx.session)) {
      return {};
    }

    const defaults = {
      supportUsername: env.SUPPORT_USERNAME,

      billingBotUsername: env.BILLING_BOT_USERNAME,
      vttBotUsername: env.VIDEO_TO_TEXT_BOT_USERNAME,
      downloaderBotUsername: env.DOWNLOADER_BOT_USERNAME,
      musicSearchBotUsername: env.MUSIC_SEARCH_BOT_USERNAME,
      tiktokVideosBotUsername: env.TIKTOK_VIDEOS_BOT_USERNAME,
      videoCaptionsBotUsername: env.VIDEO_CAPTIONS_BOT_USERNAME,

      vttBotLimit: env.VIDEO_TO_TEXT_BOT_FREE_DAILY_LIMIT,
      downloaderBotLimit: env.DOWNLOADER_BOT_FREE_DAILY_LIMIT,
      musicSearchBotLimit: env.MUSIC_SEARCH_BOT_FREE_DAILY_LIMIT,
      tiktokVideosBotLimit: env.TIKTOK_VIDEOS_BOT_FREE_DAILY_LIMIT,

      billingBotSubscriptionPrice: env.BILLING_BOT_SUBSCRIPTION_PRICE,
      tiktokVideosBotPricePerMinute: env.TIKTOK_VIDEOS_BOT_PRICE_PER_MINUTE,
    };

    if (has(ctx.session, 'editor')) {
      const editor = assignDefaults(ctx.session.editor || {});
      for (let key in editor) {
        const editorKey = camelCase(`editor_${key}`);
        defaults[editorKey] = editor[key];
      }
    }

    return defaults;
  },
});
