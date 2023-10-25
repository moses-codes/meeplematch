import Navbar from './Navbar'

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main className='w-screen'>{children}</main>
        </>
    )
}