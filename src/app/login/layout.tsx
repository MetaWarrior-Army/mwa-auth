import { Page, Header, Frame, Footer } from '@/components/layout'

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <Page>
        <Header title="Login"/>
        <Frame>
          {children}
        </Frame>
        <Footer/>
      </Page>
  );
}
