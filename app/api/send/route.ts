import { Resend } from 'resend';
import WelcomeEmail from '@/app/emails/Welcome';

const RESEND_API_KEY = 're_dFvw1SoT_2roytZFMtQvhW26TsJ13h8kM';

const resend = new Resend(RESEND_API_KEY);

export async function POST() {
  const { data, error } = await resend.emails.send({
    from: 'QR Intake <hi@brianpluhar.com>',
    to: ['pluharbrian@gmail.com', 'tflores00616@icloud.com'],
    subject: 'QR Intake - Onboarding',
    react: WelcomeEmail(),
  });

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json(data);
}

// export async function POST() {
//   const res = await fetch('https://api.resend.com/emails', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${RESEND_API_KEY}`,
//     },
//     body: JSON.stringify({
//       from: 'QR Intake <hi@brianpluhar.com>',
//       to: ['pluharbrian@gmail.com'],
//       subject: 'QR Intake - Onboarding',
//       html: WelcomeEmail(),
//     }),
//   });

//   if (res.ok) {
//     const data = await res.json();
//     return Response.json(data);
//   } else {
//     const error = await res.json();
//     return Response.json({ error }, { status: 500 });
//   }
// }