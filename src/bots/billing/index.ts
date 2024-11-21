import { ServiceId } from '../../services-id.enum';
import { env } from '../../env';
import { createBot } from '../shared';
import { IBillingBotContext } from './context.interface';
import { mainMenuRoute, paymentsRoutes } from './routes';

export const billing = createBot<IBillingBotContext>(ServiceId.Billing, {
  token: env.BILLING_BOT_TOKEN,
  secret: env.BILLING_BOT_SECRET,
});

mainMenuRoute(billing);
paymentsRoutes(billing);
