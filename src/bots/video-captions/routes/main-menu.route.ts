import { Bot } from 'grammy';
import {
  createLanguageSelectionMenu,
  languageSettingsMessage,
  SharedCallbackQuery,
} from '../../../bots/shared';
import { IVideoCaptionsBotContext } from '../context.interface';

export function mainMenuRoute(bot: Bot<IVideoCaptionsBotContext>) {
  const languageSelectionMenu = createLanguageSelectionMenu((ctx) =>
    ctx.t('video_captions_under_constructions')
  );

  bot.use(languageSelectionMenu);

  // Commands
  bot.command('start', (ctx) => ctx.t('video_captions_under_constructions'));

  bot.callbackQuery(SharedCallbackQuery.LanguageSettings, (ctx) =>
    languageSettingsMessage(ctx, languageSelectionMenu)
  );
}
