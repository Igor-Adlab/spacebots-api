import { InlineKeyboard } from 'grammy';
import { IVideoCaptionsBotContext } from '../context.interface';
import { emoji } from '@grammyjs/emoji';
import { getSupportButtonsKeyboard, SharedCallbackQuery } from '../../shared';

export function getMusicSearchKeyboard(ctx: IVideoCaptionsBotContext) {
  return new InlineKeyboard()
    .text(
      `${emoji('globe_with_meridians')} ${ctx.t('button_select_language')}`,
      SharedCallbackQuery.LanguageSettings
    )
    .append(getSupportButtonsKeyboard(ctx));
}
