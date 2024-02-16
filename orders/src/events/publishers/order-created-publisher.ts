import { Publisher, OrderCreatedEvent, Subjects } from '@dinitickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
