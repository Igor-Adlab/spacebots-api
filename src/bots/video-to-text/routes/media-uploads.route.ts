import { Bot } from 'grammy';
import { IVideoToTextBotContext } from '../context.interface';
import { randomUUID } from 'crypto';
import { usageMiddleware } from '../../shared';
import { env } from '../../../env';

export function mediaUploadsRoute(bot: Bot<IVideoToTextBotContext>) {
  bot.on(
    [':audio', ':voice'],
    usageMiddleware(env.VIDEO_TO_TEXT_BOT_FREE_DAILY_LIMIT),
    async (ctx) => {
      try {
        const file = await ctx.getFile();
        const filePath = await file.download(`/tmp/${randomUUID()}.wav`);

        const message = await ctx.reply(ctx.t('vtt_message_processing_audio'), {
          reply_parameters: { message_id: ctx.message.message_id },
        });

        const text = await ctx.diContainerScope
          .resolve('whisper')
          .getTextFromAudio(filePath);

        return message
          .editText(text)
          .then(() => ctx.diContainerScope.resolve('usage').increase());
      } catch (err) {
        return ctx.t('vtt_error_processing');
      }
    }
  );

  bot.on(
    [':video', ':video_note'],
    usageMiddleware(env.VIDEO_TO_TEXT_BOT_FREE_DAILY_LIMIT),
    async (ctx) => {
      try {
        const file = await ctx.getFile();
        const filePath = await file.download();

        const message = await ctx.reply(ctx.t('vtt_message_fetching_audio'), {
          reply_parameters: { message_id: ctx.message.message_id },
        });

        const audioPath = await ctx.diContainerScope
          .resolve('ffmpeg')
          .extractAudio(filePath);

        await message.editText(ctx.t('vtt_message_processing_audio'));

        const text = await ctx.diContainerScope
          .resolve('whisper')
          .getTextFromAudio(audioPath);

        return message
          .editText(text)
          .then(() => ctx.diContainerScope.resolve('usage').increase());
      } catch (err) {
        return ctx.t('vtt_error_processing');
      }
    }
  );
}
