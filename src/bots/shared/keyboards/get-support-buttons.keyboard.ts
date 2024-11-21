import { InlineKeyboard } from 'grammy';
import { IBotCommonCtx, ISessionDataWithLocalization } from '../interfaces';
import { emoji } from '@grammyjs/emoji';
import { SharedCallbackQuery } from '../callback-query.enum';

export function getSupportButtonsKeyboard(
  ctx: IBotCommonCtx<ISessionDataWithLocalization>
) {
  return new InlineKeyboard()
    .row()
    .text(
      `${emoji('heart_hands')} ${ctx.t('button_support')}`,
      SharedCallbackQuery.Support
    )
    .text(
      `${emoji('rabbit')} ${ctx.t('button_about')}`,
      SharedCallbackQuery.AboutUs
    );
}
