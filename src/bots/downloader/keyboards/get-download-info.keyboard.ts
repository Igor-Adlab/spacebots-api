import { chunk, has } from 'lodash';
import { InlineKeyboard } from 'grammy';
import { emoji } from '@grammyjs/emoji';

import { IDownloaderBotContext } from '../context.interface';
import { IDownloaderInfo, IDownloaderMedia } from '../../../services';

const CHUNK_SIZE = 2;

function prepareMediaChunks(
  type: IDownloaderMedia['type'],
  medias: IDownloaderMedia[],
  options: { exclude?: string[] } = {}
) {
  const list =
    medias?.filter((media) => {
      return (
        media.type === type && !(options.exclude || []).includes(media.url)
      );
    }) || [];
  return chunk(list.slice(0, 5), CHUNK_SIZE);
}

function renderVideoLabel(media: IDownloaderMedia) {
  return `${emoji('film_projector')} ${
    has(media, 'is_audio')
      ? media.is_audio
        ? emoji('speaker_low_volume')
        : emoji('muted_speaker')
      : ''
  } ${media.quality}`;
}

export function getDownloadInfoKeyboard(
  ctx: IDownloaderBotContext,
  { medias }: IDownloaderInfo,
  options: { exclude?: string[] } = {}
) {
  const keyboard = new InlineKeyboard();

  const videos = prepareMediaChunks('video', medias, options);
  const images = prepareMediaChunks('image', medias, options);
  const audios = prepareMediaChunks('audio', medias, options);

  // Add buttons for video
  if (videos.length) {
    videos.forEach((chunk) => {
      chunk.forEach((media) =>
        keyboard.url(renderVideoLabel(media), media.url)
      );
      keyboard.row();
    });

    keyboard.row();
  }

  // Add buttons for audio
  if (audios.length) {
    audios.forEach((chunk) => {
      chunk.forEach((media) =>
        keyboard.url(
          `${emoji('speaker_high_volume')} ${media.quality}`,
          media.url
        )
      );
      keyboard.row();
    });

    keyboard.row();
  }

  // Add buttons for images
  if (images.length) {
    images.forEach((chunk) => {
      chunk.forEach((media) =>
        keyboard.url(`${emoji('framed_picture')} ${media.quality}`, media.url)
      );
      keyboard.row();
    });

    keyboard.row();
  }

  keyboard.text(
    `${emoji('red_circle')} ${ctx.t('button_close')}`,
    'delete_current'
  );

  return keyboard;
}
