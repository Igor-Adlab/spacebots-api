import { InlineKeyboard } from 'grammy';
import { IMusicSearchBotContext } from '../interfaces';
import { emoji } from '@grammyjs/emoji';
import { getSupportButtonsKeyboard, SharedCallbackQuery } from '../../shared';
import { MusicSearchBotCallbackQuery } from '../callback-query.enum';

export function getMusicSearchKeyboard(ctx: IMusicSearchBotContext) {
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
      `${emoji('star')} ${ctx.t('button_subscription')}`,
      SharedCallbackQuery.Subscription
    )
    .text(
      `${emoji(`rocket`)} ${ctx.t('music_search_button_go')}`,
      MusicSearchBotCallbackQuery.Go
    )
    .append(getSupportButtonsKeyboard(ctx));
}
