export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 w-screen h-screen min-h-full m-0 p-0 overflow-auto">
      {children}
    </div>
  )
}
