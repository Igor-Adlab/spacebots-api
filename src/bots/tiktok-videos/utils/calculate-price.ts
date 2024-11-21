import { env } from '../../../env';

export function calculatePrice(duration: number) {
  if (!env.isProduction) {
    return 1;
  }

  return duration < 60
    ? env.TIKTOK_VIDEOS_BOT_PRICE_PER_MINUTE
    : Math.ceil((duration / 60) * env.TIKTOK_VIDEOS_BOT_PRICE_PER_MINUTE);
}
