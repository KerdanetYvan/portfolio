import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import LoginForm from './LoginForm';

export const metadata = { title: 'Connexion — Dashboard' };

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');

  return (
    <main id="main-content" className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-on-surface">Dashboard</h1>
          <p className="mt-2 text-sm text-muted">Accès réservé</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
