import { Page, Header, Frame, Footer } from '@/components/layout'


export default function MfaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
      <Page>
        <Header title="MFA"/>
        <Frame>
          {children}
        </Frame>
        <Footer/>
      </Page>
  );
}
