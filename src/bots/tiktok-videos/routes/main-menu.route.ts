import { Bot } from 'grammy';
import { startMessage } from '../messages';
import { ITikTokVideosBotContext } from '../interfaces';
import {
  createLanguageSelectionMenu,
  languageSettingsMessage,
  SharedCallbackQuery,
  textInfoMessage,
} from '../../../bots/shared';
import { TikTokVideosBotCallbackQuery } from '../callback-query.enum';

export function mainMenuRoute(bot: Bot<ITikTokVideosBotContext>) {
  const languageSelectionMenu = createLanguageSelectionMenu((ctx) =>
    startMessage(ctx)
  );

  bot.use(languageSelectionMenu);

  // Commands
  bot.command('start', (ctx) => startMessage(ctx, true));

  // Shared callback queries
  bot.callbackQuery(SharedCallbackQuery.MainMenu, (ctx) => startMessage(ctx));
  bot.callbackQuery(SharedCallbackQuery.LanguageSettings, (ctx) =>
    languageSettingsMessage(ctx, languageSelectionMenu)
  );

  bot.callbackQuery(SharedCallbackQuery.Donation, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'tiktok_videos_message_donation' })
  );

  bot.callbackQuery(SharedCallbackQuery.Faq, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'tiktok_videos_message_faq' })
  );

  bot.callbackQuery(SharedCallbackQuery.Limits, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'tiktok_videos_message_limits' })
  );

  // Bot specific callback queries
  bot.callbackQuery(TikTokVideosBotCallbackQuery.Go, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'tiktok_videos_message_go_video' })
  );
}
