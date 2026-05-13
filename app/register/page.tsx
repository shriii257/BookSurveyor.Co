import { MultiStepForm } from '@/components/MultiStepForm';
import { Navbar } from '@/components/Navbar';
import { getLocaleFromValue, getMessages } from '@/lib/i18n';

export default function RegisterPage({ searchParams }: { searchParams: { lang?: string } }) {
  const locale = getLocaleFromValue(searchParams.lang);
  const messages = getMessages(locale);

  return (
    <main>
      <Navbar locale={locale} messages={messages} />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[360px_1fr]">
        <div>
          <h1 className="text-4xl font-extrabold">{messages.register.title}</h1>
          <p className="mt-4 leading-7 text-text-secondary">
            List your profile for free. Customers will see your contact details only after admin approval.
          </p>
        </div>
        <MultiStepForm />
      </section>
    </main>
  );
}
