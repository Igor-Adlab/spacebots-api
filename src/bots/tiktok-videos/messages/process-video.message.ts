import _ from 'lodash';

import { env } from '../../../env';
import { assignDefaults } from '../constants';
import { ITikTokVideosBotContext } from '../interfaces';
import { ServiceId } from '../../../services-id.enum';

export async function processVideoMessage(ctx: ITikTokVideosBotContext) {
  await ctx.deleteMessage().catch(() => {});
  await ctx.answerCallbackQuery();

  const msg = await ctx.reply(
    ctx.t('tiktok_videos_message_start_video_processing')
  );

  const currentUsage = await ctx.diContainerScope
    .resolve('usage')
    .getUsageCount();

  const isPaid = currentUsage > env.TIKTOK_VIDEOS_BOT_FREE_DAILY_LIMIT;

  const request = assignDefaults({
    ...ctx.session.editor!,

    isPaid,
    chatId: msg.chat.id,
    messageId: msg.message_id,
    language: await ctx.i18n.getLocale(),
    onErrorCallbackUrl: `https://${env.API_HOST}/${ServiceId.TikTokVideos}/webhooks/error`,
    onSuccessCallbackUrl: `https://${env.API_HOST}/${ServiceId.TikTokVideos}/webhooks/success`,
    onProgressCallbackUrl: `https://${env.API_HOST}/${ServiceId.TikTokVideos}/webhooks/progress`,
  });

  try {
    if (env.isDev) {
      ctx.log.info(`Job prepared: ${JSON.stringify(request)}`);
    } else {
      ctx.log.info(`[SENDING TO WORKER]: ${JSON.stringify(request)}`);
      await ctx.diContainerScope
        .resolve('cloudRun')
        .invokeTikTokVideosJob(request);
    }

    ctx.session.editor = null;
    await ctx.diContainerScope.resolve('usage').track({ request });
  } catch (err) {
    ctx.log.info(`Job invocation error: ${JSON.stringify({ request, err })}`);
  }
}
