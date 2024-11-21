import { Bot } from 'grammy';
import { startMessage } from '../messages';
import { IVideoToTextBotContext } from '../context.interface';
import {
  createLanguageSelectionMenu,
  languageSettingsMessage,
  SharedCallbackQuery,
  textInfoMessage,
} from '../../../bots/shared';
import { VideoToTextBotCallbackQuery } from '../callback-query.enum';

export function mainMenuRoute(bot: Bot<IVideoToTextBotContext>) {
  const languageSelectionMenu = createLanguageSelectionMenu((ctx) =>
    startMessage(ctx)
  );

  bot.use(languageSelectionMenu);

  // Commands
  bot.command('start', (ctx) => startMessage(ctx, true));
  bot.command('me', (ctx) => {
    ctx.reply(
      JSON.stringify({
        user: ctx.diContainerScope.resolve('user'),
        serviceId: ctx.diContainerScope.resolve('serviceId'),
      })
    );
  });

  // Shared callback queries
  bot.callbackQuery(SharedCallbackQuery.MainMenu, (ctx) => startMessage(ctx));
  bot.callbackQuery(SharedCallbackQuery.LanguageSettings, (ctx) =>
    languageSettingsMessage(ctx, languageSelectionMenu)
  );

  bot.callbackQuery(SharedCallbackQuery.Subscription, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'shared_message_subscription' })
  );

  bot.callbackQuery(SharedCallbackQuery.Faq, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'vtt_message_faq' })
  );

  bot.callbackQuery(SharedCallbackQuery.Limits, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'vtt_message_limits' })
  );

  // Bot specific callback queries
  bot.callbackQuery(VideoToTextBotCallbackQuery.Go, (ctx) =>
    textInfoMessage(ctx, { localizationKey: 'vtt_message_go' })
  );
}