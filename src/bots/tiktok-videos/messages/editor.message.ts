import { assignDefaults } from '../constants';
import { getEditorKeyboard } from '../keyboards';
import { ITikTokVideosBotContext, Template } from '../interfaces';
import { random } from 'lodash';

export async function editorMessage(
  ctx: ITikTokVideosBotContext,
  initial = false
) {
  const keyboard = getEditorKeyboard(ctx);
  const editor = assignDefaults(ctx.session.editor! || {});

  const backdropsService = ctx.diContainerScope.resolve('backdrops');
  // Set random backdrop type if its not set

  let video = await backdropsService.getVideoInfoByUrl(editor.backdropVideoUrl);

  // Set random backdrop video if its not set
  if (!editor.backdropVideoUrl) {
    video = await backdropsService.getRandomBackdropVideo(
      editor.backdropTypeId
    );

    editor.backdropTypeId = video.category;
    editor.backdropVideoUrl = video.videoUrl;
    ctx.session.editor.backdropStart = random(
      0,
      Number(video.duration) - (ctx.session.editor!.duration || 0),
      false
    );
  }

  ctx.session.editor = editor;

  let message;
  if (editor.template == Template.Split) {
    message = ctx.t('tiktok_videos_message_video_settings_split', {
      ratioTop: editor.ratio[0],
      ratioBottom: editor.ratio[1],
      backdropTypeName: editor.backdropTypeId,
      position: ctx.t(`tiktok_videos_position_${editor.position}`),
    });
  } else if (editor.template == Template.Popup) {
    message = ctx.t('tiktok_videos_message_video_settings_popup', {
      backdropTypeName: editor.backdropTypeId,
      position: ctx.t(`tiktok_videos_position_${editor.position}`),
    });
  }

  if (initial) {
    await ctx.reply(message, { reply_markup: keyboard });
  } else {
    ctx.editMessageText(message, { reply_markup: keyboard });
  }
}
