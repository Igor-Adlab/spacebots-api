import { Api, Bot, RawApi } from 'grammy';
import { TikTokVideosBotCallbackQuery } from '../callback-query.enum';
import * as menus from '../menus';
import * as messages from '../messages';
import { ITikTokVideosBotContext } from '../interfaces';
import { rollsManagementMessage } from '../messages';
import { payAsYouGoUsageMiddleware } from '../middlewares';
import { env } from '../../../env';

export function videoEditorRoute(
  bot: Bot<ITikTokVideosBotContext, Api<RawApi>>
) {
  // Menus
  bot.use(menus.soundSettingsMenu);
  bot.use(menus.ratioSelectionMenu);
  bot.use(menus.verticalPositionMenu);
  bot.use(menus.templateSelectionMenu);
  bot.use(menus.backdropSelectionMenu);

  // Rolls management menu
  bot.use(menus.rollDeletionMenu);
  bot.use(menus.rollManagementMenu);
  bot.use(menus.rollsSelectionMenu);

  // Handlers
  bot.callbackQuery(
    TikTokVideosBotCallbackQuery.OpenEditor,
    payAsYouGoUsageMiddleware(env.TIKTOK_VIDEOS_BOT_FREE_DAILY_LIMIT),
    (ctx) => messages.editorMessage(ctx)
  );
  bot.callbackQuery(TikTokVideosBotCallbackQuery.RollManagement, (ctx) =>
    rollsManagementMessage(ctx)
  );
  bot.callbackQuery(TikTokVideosBotCallbackQuery.SelectTemplate, (ctx) =>
    messages.editorTextInfoMessage(ctx, {
      menu: menus.templateSelectionMenu,
      localizationKey: 'tiktok_videos_message_editor_templates_info',
    })
  );
  bot.callbackQuery(
    TikTokVideosBotCallbackQuery.SelectVerticalPosition,
    (ctx) =>
      messages.editorTextInfoMessage(ctx, {
        localizationKey: 'tiktok_videos_message_editor_vertical_position',
        menu: menus.verticalPositionMenu,
      })
  );
  bot.callbackQuery(TikTokVideosBotCallbackQuery.SoundSettings, (ctx) =>
    messages.editorTextInfoMessage(ctx, {
      localizationKey: 'tiktok_videos_message_editor_sound_settings',
      menu: menus.soundSettingsMenu,
    })
  );
  bot.callbackQuery(TikTokVideosBotCallbackQuery.BackdropSettings, (ctx) => {
    // Workaround: clear backdrops pagination on return to editor
    ctx.session.backdropPagination = null;

    messages.editorTextInfoMessage(ctx, {
      localizationKey: 'tiktok_videos_message_editor_backdrop',
      menu: menus.backdropSelectionMenu,
    });
  });
  bot.callbackQuery(TikTokVideosBotCallbackQuery.RatioSettings, (ctx) =>
    messages.editorTextInfoMessage(ctx, {
      localizationKey: 'tiktok_videos_message_editor_ratio',
      menu: menus.ratioSelectionMenu,
    })
  );
  bot.callbackQuery(TikTokVideosBotCallbackQuery.CloseEditor, (ctx) => {
    ctx.session.editor = undefined;
    return messages.startMessage(ctx);
  });

  bot.callbackQuery(
    TikTokVideosBotCallbackQuery.ProcessVideo,
    payAsYouGoUsageMiddleware(env.TIKTOK_VIDEOS_BOT_FREE_DAILY_LIMIT),
    async (ctx) => messages.processVideoMessage(ctx)
  );
}
