import Script from 'next/script'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics não configurado (falta NEXT_PUBLIC_GA_MEASUREMENT_ID)')
    return null
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  )
}
