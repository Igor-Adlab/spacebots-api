import { env } from '../../env';
import { createBot } from '../shared';
import { ServiceId } from '../../services-id.enum';
import { ITikTokVideosBotContext } from './interfaces';
import {
  mainMenuRoute,
  paymentsRoutes,
  videoEditorRoute,
  mediaUploadsRoute,
} from './routes';
import { payAsYouGoUsageMiddleware } from './middlewares';

export const tiktok = createBot<ITikTokVideosBotContext>(
  ServiceId.TikTokVideos,
  {
    token: env.TIKTOK_VIDEOS_BOT_TOKEN,
    secret: env.TIKTOK_VIDEOS_BOT_SECRET,
  }
);

mainMenuRoute(tiktok);
paymentsRoutes(tiktok);
videoEditorRoute(tiktok);
mediaUploadsRoute(tiktok);
