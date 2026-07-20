import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-[120px] font-black leading-none text-[#0054A6] opacity-10 md:text-[180px]">404</h1>
      <div className="-mt-12 md:-mt-20">
        <h2 className="mb-4 text-2xl font-bold text-[#1a2e44] md:text-4xl">Sahifa topilmadi</h2>
        <p className="mx-auto mb-8 max-w-md text-sm text-gray-500 md:text-base">
          Afsuski, siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko&apos;chirilgan.
        </p>
        <Link href="/" className="inline-block rounded-xl bg-[#0054A6] px-10 py-4 text-[11px] font-bold uppercase tracking-[2px] text-white shadow-lg transition-all hover:bg-[#1a2e44] active:scale-95">
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
