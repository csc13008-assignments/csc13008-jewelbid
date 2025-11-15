import { Header, Footer } from '@/modules/shared/components/layout';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="font-body">{children}</main>
            <Footer />
        </>
    );
}
