import {
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function WelcomeEmail() {
  return (
    <Html lang="en">  
      <Tailwind>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </Head>
        <div className="py-8" style={{ fontFamily: "'Noto Sans', -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'" }}>
          <Container className="mx-auto w-full max-w-[650px] rounded-2xl border border-[#1e293b] bg-[#111827] px-6 py-6">
            <Section>
              <Heading as="h2" className="m-0 text-[24px] font-semibold leading-7 text-[#e2e8f0]">
                Welcome to QR Intake
              </Heading>
              <Text className="mt-1 text-[14px] leading-6 text-[#94a3b8]">
                Hi there, we’re excited to have you on board! You can create and share QR-powered intake forms, review submissions, and streamline your workflow.
              </Text>
            </Section>

            <Section className="mt-4">
              <a
                href="https://qr-intake.vercel.app/dashboard"
                className="inline-block rounded-md bg-[#249F73] px-4 py-2 text-[14px] font-medium text-white no-underline hover:bg-[#1E8761]"
              >
                Go to Dashboard
              </a>
            </Section>

            <Section className="mt-6 rounded-lg border border-[#1e293b] bg-[#0f172a] p-4">
              <Heading as="h3" className="m-0 text-[16px] font-semibold text-[#e2e8f0]">
                What’s next
              </Heading>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-6 text-[#94a3b8]">
                <li>Create an intake form and customize fields</li>
                <li>Share the QR code or link with patients</li>
                <li>Track submissions in your dashboard</li>
              </ul>
            </Section>

            <Hr className="my-6 border-[#1e293b]" />

            <Text className="m-0 text-[12px] leading-5 text-[#64748b]">
              You’re receiving this email because you signed up for QR Intake.
              If you didn’t expect this, you can safely ignore it.
            </Text>
          </Container>
        </div>
      </Tailwind>
    </Html>
  );
}