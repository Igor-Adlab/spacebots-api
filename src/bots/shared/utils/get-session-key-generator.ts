import { Context } from 'grammy';

export function getSessionKeyGenerator(service: string) {
  return function getSessionKey(ctx: Context): string | undefined {
    const from =
      ctx.from?.id || ctx.chat?.id || ctx.preCheckoutQuery?.from?.id || -1;
    return `spacebots_${service}/${from}`;
  };
}
