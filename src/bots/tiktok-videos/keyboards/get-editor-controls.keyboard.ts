import { InlineKeyboard } from 'grammy';
import { ITikTokVideosBotContext } from '../interfaces';
import { TikTokVideosBotCallbackQuery } from '../callback-query.enum';

export const getEditorControlsKeyboard = (ctx: ITikTokVideosBotContext) =>
  new InlineKeyboard()
    .text(
      ctx.emoji`${'red_circle'} ${ctx.t('tiktok_videos_button_close_editor')}`,
      TikTokVideosBotCallbackQuery.CloseEditor
    )
    .text(
      ctx.emoji`${'rocket'} ${ctx.t('tiktok_videos_button_process_video')}`,
      TikTokVideosBotCallbackQuery.ProcessVideo
    );
