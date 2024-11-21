import { env } from '../../env';
import { ServiceId } from '../../services-id.enum';
import { createBot } from '../shared';
import { IDownloaderBotContext } from './context.interface';
import { mainMenuRoute, urlRoute } from './routes';

export const downloader = createBot<IDownloaderBotContext>(
  ServiceId.Downloader,
  {
    token: env.DOWNLOADER_BOT_TOKEN,
    secret: env.DOWNLOADER_BOT_SECRET,
  }
);

mainMenuRoute(downloader);
urlRoute(downloader);
