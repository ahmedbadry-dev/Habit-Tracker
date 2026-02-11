
export const Header = ({ children }: { children: React.ReactNode }) => {
    return (
        <header className="mb-10">
            <div className="flex items-center justify-between">
                {children}
            </div>
        </header>
    )
}
