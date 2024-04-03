import { Page, Header, Frame, Footer } from '@/components/app/layout'

export default function SigninLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
