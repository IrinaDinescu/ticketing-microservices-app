import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resove, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resove();
      });
      this.client.on('error', (error) => {
        console.log(error);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
