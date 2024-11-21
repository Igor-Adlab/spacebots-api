import { emoji } from '@grammyjs/emoji';
import { Menu, type MenuFlavor, MenuRange } from '@grammyjs/menu';

import type { ITikTokVideosBotContext, SplitOptions } from '../interfaces';
import { editorMessage } from '../messages';
import { backToEditorRange } from './back-to-editor.range';

export const ratioSelectionMenu = new Menu<ITikTokVideosBotContext>(
  'ratio-selection'
);

const ratio: [number, number][][] = [
  [
    [33, 66],
    [66, 33],
  ],
  [
    [25, 75],
    [50, 50],
    [75, 25],
  ],
];

ratioSelectionMenu.dynamic((ctx) => {
  const range = new MenuRange<ITikTokVideosBotContext>();
  const current = (ctx.session.editor as SplitOptions)!.ratio;
  for (const list of ratio) {
    for (const tuple of list) {
      range.text(
        getRatioLabel(current, tuple),
        getRatioSelectionHandler(current, tuple)
      );
    }

    range.row();
  }

  range.append(backToEditorRange);
  return range;
});

function getRatioLabel(
  current: SplitOptions['ratio'],
  ratio: [number, number]
) {
  const icon =
    current[0] == ratio[0] && current[1] == ratio[1]
      ? emoji('green_circle')
      : '';
  return `${icon} ${ratio[0]}% / ${ratio[1]}%`;
}

function getRatioSelectionHandler(
  current: SplitOptions['ratio'],
  ratio: [number, number]
) {
  return (ctx: ITikTokVideosBotContext & MenuFlavor) => {
    if (current[0] == ratio[0] && current[1] == ratio[1]) {
      return;
    }

    (ctx.session.editor as SplitOptions)!.ratio = ratio;
    return editorMessage(ctx);
  };
}
