import { IBotCommonCtx, ISessionDataWithLocalization } from '../../shared';
import { Editor } from './editor.interface';

export interface ITikTokVideosBotSessionData
  extends ISessionDataWithLocalization {
  editor?: Editor;

  // rolls management
  rollVideoUrl?: string;
  rollVideoDuration?: number;
  rollDeletionRequest?: 'pre-roll' | 'post-roll';

  // paginations
  backdropPagination?: { page: number; size: number };
}

export interface ITikTokVideosBotContext
  extends IBotCommonCtx<ITikTokVideosBotSessionData> {}
