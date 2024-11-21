import { InlineKeyboard } from 'grammy';
import { IVideoToTextBotContext } from '../context.interface';
import { emoji } from '@grammyjs/emoji';
import { getSupportButtonsKeyboard, SharedCallbackQuery } from '../../shared';
import { VideoToTextBotCallbackQuery } from '../callback-query.enum';

export function getVttKeyboard(ctx: IVideoToTextBotContext) {
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
      `${emoji(`rocket`)} ${ctx.t('vtt_button_go')}`,
      VideoToTextBotCallbackQuery.Go
    )
    .append(getSupportButtonsKeyboard(ctx));
}
