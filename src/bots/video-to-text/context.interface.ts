import { IBotCommonCtx, ISessionDataWithLocalization } from '../shared';

export interface IVideoToTextBotSessionData
  extends ISessionDataWithLocalization {}

export interface IVideoToTextBotContext
  extends IBotCommonCtx<IVideoToTextBotSessionData> {}
