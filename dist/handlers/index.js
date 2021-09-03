"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FBEventsHandler = void 0;
const facebook_conversion_api_1 = __importDefault(require("@rivercode/facebook-conversion-api"));
const request_1 = require("../utils/request");
/**
 * Facebook Conversion API Event Handler for Next.js.
 *
 * @param req
 * @param res
 * @constructor
 */
const FBEventsHandler = (req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({
            message: 'This route only accepts POST requests',
        });
    }
    if (!process.env.FB_ACCESS_TOKEN) {
        throw new Error('Missing FB_ACCESS_TOKEN in environment file.');
    }
    if (!process.env.FB_PIXEL_ID) {
        throw new Error('Missing FB_PIXEL_ID in environment file.');
    }
    const { eventName, emails, phones, products, value, currency, debug, } = req.body;
    if (!eventName || !products || (products === null || products === void 0 ? void 0 : products.length) < 1) {
        return res.status(400).json({
            error: 'The request body is missing required parameters',
        });
    }
    const FBConversionAPI = new facebook_conversion_api_1.default(process.env.FB_ACCESS_TOKEN, process.env.FB_PIXEL_ID, emails !== null && emails !== void 0 ? emails : null, phones !== null && phones !== void 0 ? phones : null, (0, request_1.clientIpAddress)(req), (0, request_1.clientUserAgent)(req), (0, request_1.clientFbpCookie)(req), (0, request_1.clientFbcCookie)(req), debug);
    products.forEach((product) => {
        FBConversionAPI.addProduct(product.sku, product.quantity);
    });
    FBConversionAPI.sendEvent(eventName, (0, request_1.clientRefererUrl)(req), { value, currency });
    return res.status(200).json({
        status: 'Success',
    });
};
exports.FBEventsHandler = FBEventsHandler;
