import './globals.css'; import Nav from '@/components/Nav';
export const metadata={title:'Formula Desk',description:'Math reference, calculator, converter and word-problem solver'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body><Nav/><main className="wrap">{children}</main></body></html>}
