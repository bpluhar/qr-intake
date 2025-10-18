import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <html>
      <body>
        <h1>Welcome, {firstName}!</h1>
      </body>
    </html>
  );
}