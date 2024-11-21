import { asValue, AwilixContainer } from 'awilix';
import { MiddlewareFn } from 'grammy';
import { UsersService } from '../../../services';
import { logger } from '../../../logger';
import { IBotCommonCtx, ISessionDataWithLocalization } from '../interfaces';
import { isNil } from 'lodash';

export type AwilixFlavor<Cradle extends object = any> = {
  diContainerScope: AwilixContainer<Cradle>;
};
export type AwilixOptions = { disposeOnReply?: boolean; serviceId: string };

export function awilix<C extends IBotCommonCtx<ISessionDataWithLocalization>>(
  diContainer: AwilixFlavor['diContainerScope'],
  options: AwilixOptions
): MiddlewareFn<C & AwilixFlavor> {
  return async (ctx, next) => {
    ctx.diContainerScope = diContainer.createScope();

    // Find user
    const userId = ctx.message?.from?.id ?? ctx.callbackQuery?.from?.id;
    const userName =
      ctx.message?.from?.first_name ?? ctx.callbackQuery?.from?.first_name;

    const service = ctx.diContainerScope.resolve<UsersService>('users');
    let user = await service.register(userId, userName);

    if (
      (!ctx.preCheckoutQuery || !isNil(ctx.session)) &&
      ctx.session.__language_code !== user.language
    ) {
      user = await ctx.diContainerScope
        .resolve<UsersService>('users')
        .setLanguage(userId, ctx.session.__language_code);
    }

    ctx.diContainerScope.register(
      'logger',
      asValue(logger.child({ bot: options.serviceId }))
    );

    // Add user to DI container
    ctx.diContainerScope.register('user', asValue(user));
    ctx.diContainerScope.register('serviceId', asValue(options.serviceId));

    ctx.api.config.use(async (prev, method, payload, signal) => {
      if (options?.disposeOnReply) await ctx.diContainerScope.dispose();
      return await prev(method, payload, signal);
    });
    return await next();
  };
}
