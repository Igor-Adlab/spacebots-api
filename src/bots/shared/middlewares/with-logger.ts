import pino from 'pino';
import { IBotCommonCtx } from '../interfaces/bot-common-ctx.interface';

export interface LoggerFlavor {
  log: pino.Logger;
}

export function withLogger<T>(log: pino.Logger) {
  return (ctx: IBotCommonCtx<T>, next) => {
    ctx.log = log;
    return next();
  };
}
