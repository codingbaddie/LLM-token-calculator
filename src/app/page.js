'use client'

import dynamic from 'next/dynamic'

// 使用动态导入，禁用 SSR
const TokenCalculator = dynamic(
  () => import('@/components/TokenCalculator'),
  { ssr: false }
)

export default function Home() {
  return (
    <main>
      <TokenCalculator />
    </main>
  )
}