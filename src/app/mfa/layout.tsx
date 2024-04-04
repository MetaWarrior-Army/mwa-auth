import {Page, Header, Frame } from '@/components/app/layout'

export default function MfaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <>
    <Page>
      {children}  
    </Page>
    </>
  )
}
