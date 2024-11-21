import { InlineKeyboard } from 'grammy';
import { ITikTokVideosBotContext } from '../interfaces';
import { emoji } from '@grammyjs/emoji';
import { getSupportButtonsKeyboard, SharedCallbackQuery } from '../../shared';
import { TikTokVideosBotCallbackQuery } from '../callback-query.enum';

export function getTikTokVideosKeyboard(ctx: ITikTokVideosBotContext) {
  return new InlineKeyboard()
    .text(
      `${emoji('globe_with_meridians')} ${ctx.t('button_select_language')}`,
      SharedCallbackQuery.LanguageSettings
    )
    .text(
      `${emoji(`red_question_mark`)} ${ctx.t('button_faq')}`,
      SharedCallbackQuery.Faq
    )
    .row()
    .text(
      `${emoji('pushpin')} ${ctx.t('button_limits')}`,
      SharedCallbackQuery.Limits
    )
    .row()
    .text(
      `${emoji('star')} ${ctx.t('button_donation')}`,
      SharedCallbackQuery.Donation
    )
    .text(
      `${emoji(`rocket`)} ${ctx.t('tiktok_videos_button_go')}`,
      TikTokVideosBotCallbackQuery.Go
    )
    .append(getSupportButtonsKeyboard(ctx));
}
