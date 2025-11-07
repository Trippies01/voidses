import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="h-full flex items-center justify-center flex-col space-y-4">
      <h2 className="text-2xl font-bold">Sayfa Bulunamadı</h2>
      <p className="text-zinc-500 dark:text-zinc-400">İstediğiniz sayfa mevcut değil.</p>
      <Link 
        href="/"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}

