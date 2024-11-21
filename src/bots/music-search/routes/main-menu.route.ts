import { Bot } from 'grammy';
import { startMessage } from '../messages';
import { IMusicSearchBotContext } from '../interfaces';
import {
  createLanguageSelectionMenu,
  languageSettingsMessage,
  SharedCallbackQuery,
  textInfoMessage,
} from '../../../bots/shared';
import { MusicSearchBotCallbackQuery } from '../callback-query.enum';

export function mainMenuRoute(bot: Bot<IMusicSearchBotContext>) {
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

  bot.callbackQuery(SharedCallbackQuery.Subscription, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'shared_message_subscription' })
  );

  bot.callbackQuery(SharedCallbackQuery.Faq, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'music_search_message_faq' })
  );

  bot.callbackQuery(SharedCallbackQuery.Limits, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'music_search_message_limits' })
  );

  // Bot specific callback queries
  bot.callbackQuery(MusicSearchBotCallbackQuery.Go, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'music_search_message_go' })
  );
}
