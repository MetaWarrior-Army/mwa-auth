import { Page, Header, Frame, Footer } from '@/components/layout'

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <Page>
        <Header/>
        <Frame>
          {children}
        </Frame>
        <Footer/>
      </Page>
  );
}
