import { Menu } from '@grammyjs/menu';
import { chunk } from 'lodash';
import { emoji } from '@grammyjs/emoji';
import { IMusicSearchBotContext } from '../interfaces';
import { env } from '../../../env';

const PAGE_SIZE = env.MUSIC_SEARCH_BOT_PAGE_SIZE;
const RESULT_COLUMNS = env.MUSIC_SEARCH_BOT_RESULT_COLUMNS;

export const tracksListMenu = new Menu<IMusicSearchBotContext>('music-list');

tracksListMenu.dynamic((ctx, range) => {
  const { songs, page = 0 } = ctx.session;

  const chunks = chunk(songs, PAGE_SIZE);
  const current = chunks[page];

  const grid = chunk(current, RESULT_COLUMNS);
  for (let row of grid) {
    row.forEach((item) => {
      const url = item.url;
      const title = `${item.duration} ${item.name} ${item.artist}`.slice(0, 50);
      range.text(title, async (ctx) => {
        const msg = await ctx.reply(
          ctx.t('music_search_message_sending_audio')
        );
        try {
          await ctx
            .replyWithAudio(url, { caption: title })
            .then(() => msg.delete());
        } catch (err) {
          ctx.log.error(`Audio ${url} sending error: ${err}`);
          msg.editText(ctx.t('music_search_error_sending_audio', { url }));
        }
      });
    });
    range.row();
  }

  if (page > 0) {
    range.text(emoji('left_arrow'), async (ctx) => {
      ctx.session.page = page - 1;
      await ctx.menu.update();
    });
  }

  if (page < chunks.length - 1) {
    range.text(emoji('right_arrow'), async (ctx) => {
      ctx.session.page = page + 1;
      await ctx.menu.update();
    });
  }

  range
    .row()
    .text(`${emoji('cross_mark')} ${ctx.t('button_close')}`, async (ctx) => {
      await ctx.deleteMessage();
      ctx.session.page = 0;
      ctx.session.songs = [];
    });
});
