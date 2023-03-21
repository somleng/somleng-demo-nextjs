import type { NextApiRequest, NextApiResponse } from "next";

interface PhoneCallRequest extends NextApiRequest {
  body: {
    phoneNumber: string;
    recaptchaToken: string;
  };
}

type ResponseData = {
  success: boolean;
  data: string;
};

export default function handler(req: PhoneCallRequest, res: NextApiResponse<ResponseData>) {
  fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.recaptchaToken}`,
  })
    .then((captchaResponse) => captchaResponse.json())
    .then((captchaResponse) => {
      if (captchaResponse.score < 0.5) {
        return res.status(400).json({ success: false, data: "Recaptcha verification failed" });
      }

      if (!req.body.phoneNumber) {
        return res.status(400).json({ success: false, data: "Phone number is blank" });
      }

      // ... send to Somleng API

      return res
        .status(200)
        .json({ success: true, data: `Sent a call to : ${req.body.phoneNumber}` });
    });
}
