import { InlineKeyboard } from 'grammy';
import { IBotCommonCtx, ISessionDataWithLocalization } from '../interfaces';
import { emoji } from '@grammyjs/emoji';
import { SharedCallbackQuery } from '../callback-query.enum';

export function getBackButtonKeyboard(
  ctx: IBotCommonCtx<ISessionDataWithLocalization>
) {
  return new InlineKeyboard().text(
    `${emoji('left_arrow')} ${ctx.t('button_back')}`,
    SharedCallbackQuery.MainMenu
  );
}
