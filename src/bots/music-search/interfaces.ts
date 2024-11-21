import { ISongInfo } from '../../services';
import { IBotCommonCtx, ISessionDataWithLocalization } from '../shared';

export interface IMusicSearchBotSessionData
  extends ISessionDataWithLocalization {
  songs?: ISongInfo[];

  // Pagination and menu message
  page?: number;
  menuMessageId?: number;
}

export interface IMusicSearchBotContext
  extends IBotCommonCtx<IMusicSearchBotSessionData> {}
