import { v4 as uuidv4 } from 'uuid';
import debug from './utils/debug';
import FBEventType from '../types';

declare global {
  interface Window {
    fbq: any;
  }
}

/**
 * Trigger Facebook PageView Event (Standard Pixel).
 *
 * @constructor
 */
const fbPageView = (): void => {
  debug('Client Side Event: PageView');

  window.fbq('track', 'PageView');
};

/**
 * Trigger custom Facebook Event (Conversion API and optionally Standard Pixel).
 *
 * @param event
 * @constructor
 */
const fbEvent = (event: FBEventType): void => {
  const eventId = event.eventId ? event.eventId : uuidv4();

  if (event.enableStandardPixel) {
    const clientSidePayload = {
      content_type: 'product',
      contents: event.products.map((product) => (
        { id: product.sku, quantity: product.quantity }
      )),
      ...(event.value && { value: event.value }),
      ...(event.currency && { currency: event.currency }),
    };

    window.fbq('track', event.eventName, clientSidePayload, { eventID: eventId });

    debug(`Client Side Event: ${event.eventName}`);
    debug(`Client Side Payload: ${JSON.stringify(clientSidePayload)}`);
    debug(`Client Side Event ID: ${eventId}`);
  }

  setTimeout(() => {
    const forbiddenParams = ['lat', 'lng'];
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    forbiddenParams.forEach((param) => urlParams.delete(param));
    const url = `${window.location.href.split('?')[0]}?${urlParams.toString()}`;

    const serverSidePayload = JSON.stringify({
      eventName: event.eventName,
      eventId,
      emails: event.emails,
      phones: event.phones,
      products: event.products,
      value: event.value,
      currency: event.currency,
      userAgent: navigator.userAgent,
      sourceUrl: url,
      testEventCode: event.testEventCode,
      firstName: event.firstName,
      lastName: event.lastName,
      fbc: event.fbc,
    });

    fetch('/api/fb-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: serverSidePayload,
    }).then((response) => {
      debug(`Server Side Event: ${event.eventName} (${response.status})`);
      debug(`Server Side Payload: ${serverSidePayload}`);
    }).catch((error) => {
      debug(`Server Side Event: ${event.eventName} (${error.status})`);
    });
  }, 250);
};

export { fbEvent, fbPageView };
