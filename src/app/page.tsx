import Calculator from '@/components/Calculator'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-wide">
        🧮 Calculator
      </h1>
      <Calculator />
    </main>
  )
}
