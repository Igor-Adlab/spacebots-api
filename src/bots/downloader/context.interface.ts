import { IDownloaderInfo } from '../../services';
import { IBotCommonCtx, ISessionDataWithLocalization } from '../shared';

export interface IDownloaderBotSessionData
  extends ISessionDataWithLocalization {
  info?: IDownloaderInfo;
}

export interface IDownloaderBotContext
  extends IBotCommonCtx<IDownloaderBotSessionData> {}
