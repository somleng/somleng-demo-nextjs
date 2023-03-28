import type { NextApiRequest, NextApiResponse } from "next";
import { Somleng } from "somleng";

interface PhoneCallRequest extends NextApiRequest {
  body: {
    phoneNumber: string;
    recaptchaToken: string;
  };
}

type ResponseData = {
  success: boolean;
  message: string;
};

export default async function handler(req: PhoneCallRequest, res: NextApiResponse<ResponseData>) {
  const captchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.recaptchaToken}`,
  });
  const captchaVerification = await captchaResponse.json();
  if (captchaVerification.score < 0.5) {
    return res.status(400).json({ success: false, message: "Recaptcha verification failed" });
  }

  if (!req.body.phoneNumber) {
    return res.status(400).json({ success: false, message: "Phone number is blank" });
  }

  const client = new Somleng();
  try {
    const phoneCall = await client.calls.create({
      twiml: process.env.TWIML,
      to: req.body.phoneNumber,
      from: process.env.FROM_PHONE_NUMBER!,
    });

    return res.status(200).json({ success: true, message: "Phone call successfully queued" });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
