import { useCallback, useState } from "react";
import { Inter } from "next/font/google";
import { Card, Alert, Input, Button, Typography } from "@material-tailwind/react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const inter = Inter({ subsets: ["latin"] });

type AlertNotification = {
  display: false | "error" | "success";
  message?: string;
};

export default function Home() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [alertNotification, setAlertNotification] = useState({
    display: false,
  } as AlertNotification);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = useCallback(
    (e: Event) => {
      e.preventDefault();
      if (!executeRecaptcha) {
        console.log("Execute recaptcha not yet available");
        return;
      }

      executeRecaptcha("formSubmit").then(async (gReCaptchaToken) => {
        console.log(gReCaptchaToken, "response Google reCaptcha server");

        const form = e.target as HTMLFormElement;
        const params = {
          phoneNumber: form.phoneNumber.value as string,
          recaptchaToken: gReCaptchaToken,
        };

        const response = await fetch("api/phone-calls", {
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        const responseBody = await response.json();
        if (response.status == 200) {
          setPhoneNumber("");
          setAlertNotification({ display: "success", message: "Phone call successfully queued." });
        } else {
          setAlertNotification({ display: "error", message: responseBody.data });
        }
      });
    },
    [executeRecaptcha]
  );

  const handleOnChange = (value: string) => {
    setPhoneNumber(value);
    setAlertNotification({ display: false });
  };

  return (
    <>
      {alertNotification.display && (
        <div className="p-8 absolute right-0">
          <Alert
            color={alertNotification.display === "success" ? "green" : "red"}
            dismissible={{
              onClose: () => setAlertNotification({ display: false }),
            }}
          >
            {alertNotification.message}
          </Alert>
        </div>
      )}

      <div className="layout flex min-h-screen flex-col items-center justify-center text-center">
        <Card color="transparent" shadow={false}>
          <Typography variant="h1" color="blue-gray">
            Demo
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Enter your phone number to receive calls.
          </Typography>
          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col gap-6">
              <PhoneInput
                international={false}
                countries={["CA", "US"]}
                name="phoneNumber"
                placeholder="Enter phone number"
                className="border-solid"
                value={phoneNumber}
                onChange={handleOnChange}
              />
            </div>

            <Button type="submit" className="mt-6" fullWidth>
              Submit
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
