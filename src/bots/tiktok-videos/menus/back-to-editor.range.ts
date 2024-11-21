import { MenuRange } from '@grammyjs/menu';

import { editorMessage } from '../messages';
import { ITikTokVideosBotContext } from '../interfaces';

export const backToEditorRange = new MenuRange<ITikTokVideosBotContext>().text(
  (ctx) =>
    ctx.emoji`${'left_arrow'} ${ctx.t('tiktok_videos_button_back_editor')}`,
  (ctx) => editorMessage(ctx)
);
