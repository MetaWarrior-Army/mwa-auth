import { Page, Header, Frame, Footer } from '@/components/app/layout'
import {cookies} from 'next/headers'

export default function SIWELayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const cookieStore = cookies()
  if(cookieStore.has('verify_redirect_to')){
    console.log('Found verify_redirect_to')
  }
  else{
    console.log('/mfa/verify has no redirect')
  }

  return (
    <>
      {children}
    </>
  );
}
