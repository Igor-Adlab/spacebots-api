import { InlineKeyboard } from 'grammy';
import { ITikTokVideosBotContext, Template } from '../interfaces';
import { emoji } from '@grammyjs/emoji';
import { TikTokVideosBotCallbackQuery } from '../callback-query.enum';
import { getEditorControlsKeyboard } from './get-editor-controls.keyboard';
import { assignDefaults } from '../constants';

export function getEditorKeyboard(ctx: ITikTokVideosBotContext) {
  const editor = assignDefaults(ctx.session.editor!);
  const keyboard = new InlineKeyboard()
    .text(
      `${emoji('dashing_away')} ${ctx.t('tiktok_videos_button_template')}`,
      TikTokVideosBotCallbackQuery.SelectTemplate
    )
    .text(
      `${emoji(`framed_picture`)} ${ctx.t('tiktok_videos_button_backdrop')}`,
      TikTokVideosBotCallbackQuery.BackdropSettings
    )
    .row()
    .text(
      ctx.emoji`${'speaker_high_volume'} ${ctx.t(
        'tiktok_videos_button_sound_settings'
      )}`,
      TikTokVideosBotCallbackQuery.SoundSettings
    )
    .text(
      `${emoji('movie_camera')} Pre- / Post-roll`,
      TikTokVideosBotCallbackQuery.RollManagement
    )
    .row();

  if (editor.template == Template.Popup || editor.template == Template.Split) {
    keyboard.text(
      ctx.emoji`${'up_down_arrow'} ${ctx.t('tiktok_videos_button_position')}`,
      TikTokVideosBotCallbackQuery.SelectVerticalPosition
    );
  }

  if (editor.template == Template.Split) {
    keyboard.text(
      `${emoji('up_down_arrow')} ${editor.ratio?.[0]} / ${
        editor.ratio?.[1]
      } ${ctx.t('tiktok_videos_button_ratio')}`,
      TikTokVideosBotCallbackQuery.RatioSettings
    );
  }

  keyboard.row().append(getEditorControlsKeyboard(ctx));

  return keyboard;
}
