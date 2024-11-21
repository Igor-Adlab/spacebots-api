import { Logger } from 'pino';
import { DateTimeUtils } from '../utils';
import { PrismaClient, User } from '@prisma/client';

const SUBSCRIPTION_DURATION_DAYS = 30;

export class SubscriptionsService {
  private readonly user: User;
  private readonly logger: Logger;
  private readonly serviceId: string;
  private readonly prisma: PrismaClient;

  constructor({ logger, prisma, serviceId, user }) {
    this.user = user;
    this.prisma = prisma;
    this.serviceId = serviceId;
    this.logger = logger.child({ service: SubscriptionsService.name });
  }

  createSubscription(global: boolean = true) {
    this.logger.info(
      `${this.user.name}(${this.user.id}) subscribed to ${
        global ? 'all services' : `"${this.serviceId}"`
      }`
    );

    const startsAt = DateTimeUtils.getDayStart();
    const endsAt = startsAt.add(SUBSCRIPTION_DURATION_DAYS, 'days');

    return this.prisma.subscription.create({
      data: {
        endsAt: endsAt.toDate(),
        subscriberId: this.user.id,
        startsAt: startsAt.toDate(),
        service: global ? null : this.serviceId,
      },
    });
  }

  hasActiveSubscription() {
    const now = DateTimeUtils.getDayEnd().toDate();
    return this.prisma.subscription.findFirst({
      where: {
        subscriberId: this.user.id,
        endsAt: { gte: now },
        startsAt: { lte: now },
        OR: [{ service: null }, { service: this.serviceId }],
      },
    });
  }
}
