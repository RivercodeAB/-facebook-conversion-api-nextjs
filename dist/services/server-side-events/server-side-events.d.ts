import { Arguments, Response } from './server-side-events.types';
/**
 * Send server side event to Facebook Graph API.
 *
 * @param eventName
 * @param eventId
 * @param emails
 * @param phones
 * @param products
 * @param value
 * @param currency
 * @param fbc
 * @param fbp
 * @param ipAddress
 * @param userAgent
 * @param sourceUrl
 * @param testEventCode
 * @param firstName
 * @param lastName
 * @constructor
 */
declare const sendServerSideEvent: ({ eventName, eventId, emails, phones, products, value, currency, fbc, fbp, ipAddress, userAgent, sourceUrl, testEventCode, firstName, lastName }: Arguments) => Promise<Response>;
export { sendServerSideEvent, };
