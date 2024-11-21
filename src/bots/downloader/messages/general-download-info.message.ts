import {
  ForceReply,
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
} from 'grammy/types';
import { capitalize } from 'lodash';
import { IDownloaderInfo } from '../../../services';
import { IDownloaderBotContext } from '../context.interface';

export function generalDownloadInfo(
  info: IDownloaderInfo,
  ctx: IDownloaderBotContext,
  replyMarkup:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply = null
) {
  const parts = [
    `<b>${ctx.t('downloader_label_source')}:</b> ${capitalize(info.source)}`,
    `<b>${ctx.t('downloader_label_title')}:</b> ${info.title}`,
  ];

  if (info.author) {
    parts.push(`<b>${ctx.t('downloader_label_author')}: </b> ${info.author}`);
  }

  parts.push(`<b>${ctx.t('downloader_label_url')}:</b> ${info.url}`);

  const text = parts.join('\n\n');

  if (info.thumbnail) {
    return ctx.replyWithPhoto(info.thumbnail, {
      caption: text,
      reply_markup: replyMarkup,
    });
  } else {
    return ctx.reply(text, { reply_markup: replyMarkup });
  }
}
