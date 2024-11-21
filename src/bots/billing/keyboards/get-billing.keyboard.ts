import { InlineKeyboard } from 'grammy';
import { IBillingBotContext } from '../context.interface';
import { emoji } from '@grammyjs/emoji';
import { getSupportButtonsKeyboard, SharedCallbackQuery } from '../../shared';

export function getBillingKeyboard(ctx: IBillingBotContext) {
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
      `${emoji('money_mouth_face')} ${ctx.t('button_donation')}`,
      SharedCallbackQuery.Donation
    )
    .text(
      `${emoji('star')} ${ctx.t('button_subscription')}`,
      SharedCallbackQuery.Subscription
    )
    .append(getSupportButtonsKeyboard(ctx));
}
