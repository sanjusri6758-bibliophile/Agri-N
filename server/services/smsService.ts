import { db } from '../db/database.js';

export interface SendSmsResult {
  success: boolean;
  status: string;
  isDemo: boolean;
  messageId: string;
  phone: string;
  message: string;
}

export async function sendSMS(phoneNumber: string, message: string): Promise<SendSmsResult> {
  const isDemoMode = process.env.DEMO_MODE !== 'false' || !process.env.TWILIO_ACCOUNT_SID;

  if (isDemoMode) {
    const log = db.addSmsLog(phoneNumber, message, true);
    console.log(`[AgriN SMS Service] DEMO SMS SENT to ${phoneNumber}: "${message}"`);
    return {
      success: true,
      status: 'DEMO SMS SENT',
      isDemo: true,
      messageId: log.id,
      phone: phoneNumber,
      message
    };
  }

  try {
    // Production Twilio Integration
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER!;

    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const params = new URLSearchParams();
    params.append('To', phoneNumber);
    params.append('From', fromPhone);
    params.append('Body', message);

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Twilio SMS failed');
    }

    const log = db.addSmsLog(phoneNumber, message, false);
    return {
      success: true,
      status: 'DELIVERED',
      isDemo: false,
      messageId: data.sid || log.id,
      phone: phoneNumber,
      message
    };
  } catch (error: any) {
    console.warn(`[AgriN SMS Service] Live SMS sending failed: ${error.message}. Falling back to DEMO log.`);
    const log = db.addSmsLog(phoneNumber, `[FALLBACK] ${message}`, true);
    return {
      success: true,
      status: 'DEMO SMS SENT (LIVE FALLBACK)',
      isDemo: true,
      messageId: log.id,
      phone: phoneNumber,
      message
    };
  }
}
