export default function FormSectionHeading ({ children }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className="!scroll-m-8 text-xl font-semibold tracking-tight underline underline-offset-4 text-blue-500">
            {children}
        </h3>
    );
}