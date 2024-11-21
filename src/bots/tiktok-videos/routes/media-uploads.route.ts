import { Api, Bot, RawApi } from 'grammy';
import { env } from '../../../env';
import { assignDefaults } from '../constants';

import * as menus from '../menus';
import * as messages from '../messages';

import { URL } from 'url';
import { getVideoDuration } from '../../../utils';
import { ITikTokVideosBotContext } from '../interfaces';
import { textInfoMessage } from '../../shared';

export function mediaUploadsRoute(
  bot: Bot<ITikTokVideosBotContext, Api<RawApi>>
) {
  bot.on([':audio', ':voice'], async (ctx) => {
    if (!ctx.session.editor) {
      // If no editor instance
      return textInfoMessage(ctx, {
        localizationKey: 'error_no_editor',
      });
    }

    const file = await ctx.getFile();

    const duration = ctx.msg.voice?.duration ?? ctx.msg.audio?.duration ?? 0;

    // If video longer than limits
    if (duration / 60 > env.TIKTOK_VIDEOS_BOT_MAX_AUDIO_DURATION_MIN) {
      return textInfoMessage(ctx, {
        localizationKey: 'error_audio_long_duration',
      });
    }

    // Assign video and open video settings
    ctx.session.editor.audioUrl = await file.getUrl();
    return textInfoMessage(ctx, {
      initial: true,
      localizationKey: 'tiktok_videos_message_editor_sound_settings',
      menu: menus.soundSettingsMenu,
    });
  });

  bot.on('::url', async (ctx) => {
    const url = new URL(ctx.message?.text);
    if (url.host !== env.TIKTOK_VIDEOS_BOT_STORAGE_HOST) {
      return ctx.reply(ctx.t('tiktok_videos_error_url_host'));
    }

    if (!!ctx.session.editor) {
      return textInfoMessage(ctx, {
        initial: true,
        localizationKey: 'error_opened_editor',
      });
    }

    try {
      const msg = await ctx.reply(
        ctx.t('tiktok_videos_message_get_url_video_duration')
      );
      const { seconds } = await getVideoDuration(url.toString());

      if (seconds / 60 > env.TIKTOK_VIDEOS_BOT_MAX_VIDEO_DURATION_MIN) {
        await msg.delete();
        return textInfoMessage(ctx, {
          initial: true,
          localizationKey: 'error_video_duration',
        });
      } else {
        await msg.delete();
        ctx.session.editor = assignDefaults({
          videoUrl: url.toString(),
          duration: seconds,
        });
        return messages.editorMessage(ctx, true);
      }
    } catch (err) {
      this.logger.error('Video URL Error: ', { err });
      return ctx.reply(ctx.t('tiktok_videos_error_video_url'));
    }
  });

  // TODO: track usage
  bot.on([':video', ':video_note'], async (ctx) => {
    const duration =
      ctx.msg.video?.duration ?? ctx.msg.video_note?.duration ?? 0;

    let videoUrl, file;
    try {
      file = await ctx.getFile();
      videoUrl = await file.getUrl();
    } catch {
      return textInfoMessage(ctx, {
        initial: true,
        localizationKey: 'error_file_too_big',
      });
    }

    if (!file || !videoUrl) {
      return textInfoMessage(ctx, {
        initial: true,
        localizationKey: 'error_file_upload_error',
      });
    }

    if (duration / 60 >= env.TIKTOK_VIDEOS_BOT_MAX_VIDEO_DURATION_MIN) {
      // throw video error duration!
      return textInfoMessage(ctx, {
        initial: true,
        localizationKey: 'error_video_duration',
      });
    }

    if (!!ctx.session.editor) {
      if (duration <= env.TIKTOK_VIDEOS_BOT_MAX_ROLLS_DURATION_SEC) {
        ctx.session.rollVideoUrl = videoUrl;
        ctx.session.rollVideoDuration = ctx.message.video.duration;
        return messages.rollsManagementMessage(ctx, true);
      }

      return textInfoMessage(ctx, {
        initial: true,
        localizationKey: 'error_opened_editor',
      });
    }

    if (!ctx.session.editor) {
      // start new editor
      ctx.session.editor = assignDefaults({ videoUrl, duration });
      return messages.editorMessage(ctx, true);
    }
  });

  bot.on([':photo'], (ctx) =>
    textInfoMessage(ctx, {
      localizationKey: 'error_photo_not_implemented',
    })
  );
}
