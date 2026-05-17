'use client';

import { Analytics as VercelAnalytics } from '@vercel/analytics/next';

export function Analytics() {
  return (
    <VercelAnalytics
      beforeSend={(event) => {
        if (event.url.includes('/dashboard')) return null;
        return event;
      }}
    />
  );
}
