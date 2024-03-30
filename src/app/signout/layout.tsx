import { Page, Header, Frame, Footer } from '@/components/layout'
import { cookies } from 'next/headers'

export default function SigninLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = cookies()
  if(cookieStore.has('signout_redirect_to')){
    console.log('Found signout_redirect_to')
  }

  return (
    <Page>
      <Header title="Sign Out"/>
      <Frame>
        {children}
      </Frame>
      <Footer/>
    </Page>
  );
}
