export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="font-body">{children}</div>;
}
