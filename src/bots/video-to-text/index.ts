import { env } from '../../env';
import { createBot } from '../shared';
import { ServiceId } from '../../services-id.enum';
import { IVideoToTextBotContext } from './context.interface';
import { mainMenuRoute, mediaUploadsRoute } from './routes';

export const vtt = createBot<IVideoToTextBotContext>(ServiceId.VideoToText, {
  token: env.VIDEO_TO_TEXT_BOT_TOKEN,
  secret: env.VIDEO_TO_TEXT_BOT_SECRET,
});

mainMenuRoute(vtt);
mediaUploadsRoute(vtt);
