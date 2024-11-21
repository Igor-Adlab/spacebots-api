import { env } from '../../env';
import { createBot } from '../shared';
import { ServiceId } from '../../services-id.enum';
import { IMusicSearchBotContext } from './interfaces';
import { mainMenuRoute, searchRoute } from './routes';

export const music = createBot<IMusicSearchBotContext>(ServiceId.MusicSearch, {
  token: env.MUSIC_SEARCH_BOT_TOKEN,
  secret: env.MUSIC_SEARCH_BOT_SECRET,
});

mainMenuRoute(music);
searchRoute(music);
