import { Outlet, useNavigation } from 'react-router';
import { Toaster } from 'sonner';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== 'idle';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-200">
          <div className="h-full bg-blue-600 animate-pulse w-full" />
        </div>
      )}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}