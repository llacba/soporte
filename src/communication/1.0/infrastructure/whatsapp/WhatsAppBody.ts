export interface WhatsAppBody {
  messaging_product: string;
  template: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components?: Array<any>;
    language: {
      code: string;
    },
    name: string;
  },
  to: string;
  type: string;
}
