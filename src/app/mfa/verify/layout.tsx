import {Page, Frame } from '@/components/app/layout'

export default function MfaVerifyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <>
      <Frame>
        {children}
      </Frame>
    </>
  )
}
