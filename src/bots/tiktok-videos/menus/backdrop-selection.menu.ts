import { chunk, random } from 'lodash';
import { Menu, type MenuFlavor, MenuRange } from '@grammyjs/menu';

import { editorMessage } from '../messages';
import { backToEditorRange } from './back-to-editor.range';
import { ITikTokVideosBotContext } from '../interfaces';

export const backdropSelectionMenu = new Menu<ITikTokVideosBotContext>(
  'backdrop-selection'
);

backdropSelectionMenu.dynamic(async (ctx) => {
  const { page = 1, size = 5 } = ctx.session.backdropPagination || {};

  const backdropsService = ctx.diContainerScope.resolve('backdrops');

  const range = new MenuRange<ITikTokVideosBotContext>();
  const pagination = await backdropsService.getBackdropTypesPagination(
    page,
    size
  );
  const chunks = chunk(pagination.list, 1);

  let getLabel = (item) => {
    const icon =
      ctx.session.editor?.backdropTypeId === item.category
        ? ctx.emoji`${'green_circle'}`
        : '';

    return `${icon} ${item.category}`;
  };

  for (const items of chunks) {
    for (let item of items) {
      range.text(getLabel(item), getBackdropSelectionHandler(item.category));
    }

    range.row();
  }

  if (pagination.hasPrev) {
    range.text('<<', (ctx) => {
      ctx.session.backdropPagination = { page: page - 1, size };
      return ctx.menu.update();
    });
  }

  range.text(`${pagination.page} / ${pagination.totalPages}`);

  if (pagination.hasNext) {
    range.text('>>', (ctx) => {
      ctx.session.backdropPagination = { page: page + 1, size };
      return ctx.menu.update();
    });
  }

  range.row().append(backToEditorRange);
  return range;
});

function getBackdropSelectionHandler(category: string) {
  return async (ctx: ITikTokVideosBotContext & MenuFlavor) => {
    const backdropsService = ctx.diContainerScope.resolve('backdrops');

    if (ctx.session.editor.backdropTypeId == category) {
      return;
    }

    const video = await backdropsService.getRandomBackdropVideo(category);
    if (!video) {
      ctx.reply(ctx.t('tiktok_videos_error_no_backdrop_video'));
    } else {
      ctx.session.editor.backdropTypeId = category;
      ctx.session.editor.backdropVideoUrl = video.videoUrl;
      ctx.session.editor.backdropStart = random(
        0,
        Number(video.duration) - (ctx.session.editor?.duration || 0),
        false
      );
    }

    return editorMessage(ctx);
  };
}
