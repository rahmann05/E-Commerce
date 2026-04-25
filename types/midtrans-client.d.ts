declare module 'midtrans-client' {
  export class CoreApi {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey?: string });
    charge(payload: any): Promise<any>;
    transaction: {
      status(orderId: string): Promise<any>;
      notification(notificationJson: any): Promise<any>;
    };
  }

  export class Snap {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey?: string });
    createTransaction(payload: any): Promise<any>;
    createTransactionToken(payload: any): Promise<string>;
    createTransactionRedirectUrl(payload: any): Promise<string>;
  }
}
