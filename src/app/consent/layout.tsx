import { Page, Header, Frame, Footer } from '@/components/app/layout'
import { cookies } from 'next/headers'

export default function ConsentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore =cookies()

  // redirecting from client-side. Don't include Header and Footer
  if(cookieStore.has('oauth_consent_redirect')){
    return (
      <Page>
        <Frame>
          {children}
        </Frame>
      </Page>
    )
  }

  return (
      <Page>
        <Header title="Consent"/>
        <Frame>
          {children}
        </Frame>
        <Footer/>
      </Page>
  );
}
