import { Page, Header, Frame, Footer } from '@/components/layout'
import { cookies } from 'next/headers'

export default function SigninLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = cookies()
  if(cookieStore.has('signin_redirect_to')){
    console.log('Found signin_redirect_to')
  }
  else{
    console.log('/signin has no redirect')
  }

  return (
    <Page>
      <Header title="Sign In"/>
      <Frame>
        {children}
      </Frame>
      <Footer/>
    </Page>
  );
}
