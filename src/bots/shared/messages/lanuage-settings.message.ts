import { Menu } from '@grammyjs/menu';
import { IBotCommonCtx, ISessionDataWithLocalization } from '../interfaces';

export function languageSettingsMessage(
  ctx: IBotCommonCtx<ISessionDataWithLocalization>,
  languageMenu: Menu
) {
  const text = ctx.t('shared_message_language_settings');
  return ctx.editMessageText(text, { reply_markup: languageMenu });
}
