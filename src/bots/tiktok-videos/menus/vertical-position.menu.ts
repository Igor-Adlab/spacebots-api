import { emoji } from '@grammyjs/emoji';
import { Menu, type MenuFlavor, MenuRange } from '@grammyjs/menu';

import {
  ITikTokVideosBotContext,
  Template,
  VerticalPosition,
} from '../interfaces';
import { backToEditorRange } from './back-to-editor.range';

const icons: Record<VerticalPosition, string> = {
  [VerticalPosition.Top]: emoji('up_arrow'),
  [VerticalPosition.Bottom]: emoji('down_arrow'),
  [VerticalPosition.Center]: emoji('up_down_arrow'),
};

export const verticalPositionMenu = new Menu<ITikTokVideosBotContext>(
  'vertical_position'
);

verticalPositionMenu.dynamic((ctx) => buildVerticalPositionMenu(ctx));

function buildVerticalPositionMenu(ctx: ITikTokVideosBotContext) {
  const range = new MenuRange<ITikTokVideosBotContext>();
  const editor = ctx.session.editor!;

  range
    .text(
      getPositionSwitchLabel(VerticalPosition.Top),
      getPositionSwitchHandler(VerticalPosition.Top)
    )
    .row();
  if (editor.template === Template.Popup) {
    range
      .text(
        getPositionSwitchLabel(VerticalPosition.Center),
        getPositionSwitchHandler(VerticalPosition.Center)
      )
      .row();
  }
  range
    .text(
      getPositionSwitchLabel(VerticalPosition.Bottom),
      getPositionSwitchHandler(VerticalPosition.Bottom)
    )
    .row();

  // Back button
  range.append(backToEditorRange);

  return range;
}

function getPositionSwitchLabel(position: VerticalPosition) {
  return (ctx: ITikTokVideosBotContext) => {
    let icon = icons[position];
    const editor = ctx.session.editor!;

    if (editor.position == position) {
      icon = emoji('green_circle');
    }

    return `${icon} ${ctx.t(`tiktok_videos_position_${position}`)}`;
  };
}

function getPositionSwitchHandler(position: VerticalPosition) {
  return async (ctx: ITikTokVideosBotContext & MenuFlavor) => {
    const editor = ctx.session.editor!;

    if (editor.position == position) {
      return;
    }

    editor.position = position;
    await ctx.menu.update();
  };
}
