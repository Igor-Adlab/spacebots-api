import { env } from '../../env';
import { ServiceId } from '../../services-id.enum';
import { createBot } from '../shared';
import { IVideoCaptionsBotContext } from './context.interface';
import { mainMenuRoute } from './routes';

export const captions = createBot<IVideoCaptionsBotContext>(
  ServiceId.VideoCaptions,
  {
    token: env.VIDEO_CAPTIONS_BOT_TOKEN,
    secret: env.VIDEO_CAPTIONS_BOT_SECRET,
  }
);

mainMenuRoute(captions);
