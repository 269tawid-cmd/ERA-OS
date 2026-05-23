'use client'

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'
import { ACKNOWLEDGMENT_DURATION, type AcknowledgmentWeight } from '@/lib/constants/operational-rituals'

interface Acknowledgment {
  text: string
  duration: number
  id: number
  trace?: number
}

interface AcknowledgmentContextType {
  acknowledge: (text: string, weight?: AcknowledgmentWeight) => void
}

const AcknowledgmentContext = createContext<AcknowledgmentContextType | null>(null)

export function useAcknowledgment() {
  const ctx = useContext(AcknowledgmentContext)
  if (!ctx) {
    return { acknowledge: () => {} }
  }
  return ctx
}

export function OperationalAcknowledgmentProvider({ children }: { children: ReactNode }) {
  const [ack, setAck] = useState<Acknowledgment | null>(null)
  const seqRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const sessionTrace = useRef<Record<string, number>>({})

  const acknowledge = useCallback((text: string, weight: AcknowledgmentWeight = 'subtle') => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const def = ACKNOWLEDGMENT_DURATION[weight]

    let trace: number | undefined = undefined
    if (weight !== 'weighty') {
      sessionTrace.current[text] = (sessionTrace.current[text] || 0) + 1
      const count = sessionTrace.current[text]
      if (count > 1) trace = count
    }

    seqRef.current += 1
    const id = seqRef.current

    setAck({ text, duration: def, id, trace })

    timerRef.current = setTimeout(() => {
      setAck(prev => prev?.id === id ? null : prev)
    }, def)
  }, [])

  return (
    <AcknowledgmentContext.Provider value={{ acknowledge }}>
      {children}

      <div
        className="fixed bottom-20 left-6 z-30 pointer-events-none transition-opacity duration-500 ease-out"
        style={{ opacity: ack ? 1 : 0 }}
      >
        {ack && (
          <div
            key={ack.id}
            className="font-mono text-[10px] text-zinc-600 tracking-wider uppercase"
          >
            {ack.text}{ack.trace ? <span className="text-zinc-700 ml-1">({ack.trace})</span> : null}
          </div>
        )}
      </div>
    </AcknowledgmentContext.Provider>
  )
}
