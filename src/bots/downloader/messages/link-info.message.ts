import { setTimeout } from 'timers/promises';
import { InlineKeyboard } from 'grammy';
import { emoji } from '@grammyjs/emoji';
import { first, map } from 'lodash';
import { Message } from 'grammy/types';
import { Readable } from 'stream';
import { IDownloaderBotContext } from '../context.interface';
import { IDownloaderInfo, IDownloaderMedia } from '../../../services';
import { getDownloadInfoKeyboard } from '../keyboards';
import { generalDownloadInfo } from './general-download-info.message';

function toNodeReadable(readableStream) {
  const reader = readableStream.getReader();
  return new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null); // End the stream
        } else {
          this.push(Buffer.from(value)); // Push chunk to Node stream
        }
      } catch (error) {
        this.destroy(error); // Destroy the stream on error
      }
    },
  });
}

async function sendStandaloneMediaMessage(
  ctx: IDownloaderBotContext,
  media: IDownloaderMedia
) {
  const parts = [
    `<b>${ctx.t('downloader_label_type')}:</b> ${ctx.t(
      `downloader_type_${media.type}`
    )}`,
    `<b>${ctx.t('downloader_label_quality')}:</b> ${media.quality}`,
  ];

  if (media.duration) {
    parts.push(
      `<b>${ctx.t('downloader_label_duration')}:</b> ${media.duration}`
    );
  }

  if (media.height && media.width) {
    parts.push(
      `<b>${ctx.t('downloader_label_size')}:</b> ${media.width}x${media.height}`
    );
  }

  const caption = parts.join('\n\n');

  let message: Message;
  switch (media.type) {
    case 'audio':
      message = await ctx.replyWithAudio(media.url, { caption });
      break;
    case 'image':
      message = await ctx.replyWithPhoto(media.url, { caption });
      break;
    case 'video':
      try {
        message = await ctx.replyWithVideo(media.url, { caption });
      } catch (err) {
        message = await ctx.reply(
          ctx.t('downloader_message_large_video', { url: media.url })
        );
      }
      break;
    default:
      message = await ctx.reply(caption, {});
      break;
  }

  const keyboard = createStandaloneMediaButtons(ctx, media, message);

  await setTimeout(200);
  return ctx.api.editMessageReplyMarkup(message.chat.id, message.message_id, {
    reply_markup: keyboard,
  });
}

function createStandaloneMediaButtons(
  ctx: IDownloaderBotContext,
  media: IDownloaderMedia,
  message: Message
) {
  return new InlineKeyboard()
    .url(`${ctx.t('button_download')}`, media.url)
    .row()
    .text(
      `${emoji('wastebasket')} ${ctx.t('button_delete')}`,
      `delete_${message.chat.id}_${message.message_id}`
    );
}

export async function linkInfoMessage(
  ctx: IDownloaderBotContext,
  info: IDownloaderInfo
) {
  if (!info) {
    return ctx.reply(ctx.t('downloader_error_no_info'));
  }

  const standalone = info.medias?.filter(
    (media) =>
      (media.type === 'video' && !!media.thumbnail) || media.type === 'image'
  );
  try {
    // For Instagram/TikTok carousel
    if (standalone.length) {
      // Send basic info
      await generalDownloadInfo(
        info,
        ctx,
        getDownloadInfoKeyboard(ctx, info, { exclude: map(standalone, 'url') })
      );
      await setTimeout(350);

      // send standalone media
      for (let media of standalone) {
        await sendStandaloneMediaMessage(ctx, media);
        await setTimeout(350);
      }
    } else if (info.medias.length === 1) {
      // if we have only one media -- Spotify / Reels
      await sendStandaloneMediaMessage(ctx, first(info.medias));
    } else if (info.source === 'tiktok') {
      // send 2 media -- audio and no watermark
      await generalDownloadInfo(info, ctx, getDownloadInfoKeyboard(ctx, info));
      const audio = info.medias.find((media) => media.type === 'audio');
      const video = info.medias.find((media) => media.type === 'video');

      if (audio) {
        await sendStandaloneMediaMessage(ctx, audio);
      }

      if (video) {
        await sendStandaloneMediaMessage(ctx, video);
      }
    } else {
      return generalDownloadInfo(info, ctx, getDownloadInfoKeyboard(ctx, info));
    }
  } catch (err) {
    console.log(err);
    return ctx.reply('error_processing_error');
  }
}
