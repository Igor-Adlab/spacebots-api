import { IBotCommonCtx, ISessionDataWithLocalization } from '../shared';

export interface IVideoCaptionsBotSessionData
  extends ISessionDataWithLocalization {}

export interface IVideoCaptionsBotContext
  extends IBotCommonCtx<IVideoCaptionsBotSessionData> {}
