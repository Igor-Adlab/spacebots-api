import { ITikTokVideosBotContext } from '../interfaces';
import { rollManagementMenu, rollsSelectionMenu } from '../menus';

export function rollsManagementMessage(
  ctx: ITikTokVideosBotContext,
  sendNew = false
) {
  if (ctx.session.rollVideoUrl) {
    return ctx.reply(ctx.t('tiktok_videos_message_select_rolls_target'), {
      reply_markup: rollsSelectionMenu,
    });
  } else {
    const text = ctx.t('tiktok_videos_message_rolls_management');
    const options = { reply_markup: rollManagementMenu };
    if (sendNew) {
      return ctx.reply(text, options);
    } else {
      return ctx.editMessageText(text, options);
    }
  }
}
