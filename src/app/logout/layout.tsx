import { Page, Frame, Footer } from '@/components/app/layout'

export default function LogoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Page>
      <Frame>
        {children}
      </Frame>
      <Footer/>
    </Page>
  );
}
