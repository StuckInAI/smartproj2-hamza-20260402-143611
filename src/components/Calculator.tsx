'use client'

import { useState, useCallback, useEffect } from 'react'
import Display from './Display'
import Button from './Button'

type ButtonConfig = {
  label: string
  type: 'number' | 'operator' | 'action' | 'equals' | 'special'
  value: string
  wide?: boolean
}

const buttons: ButtonConfig[][] = [
  [
    { label: 'AC', value: 'AC', type: 'action' },
    { label: '+/-', value: 'TOGGLE', type: 'action' },
    { label: '%', value: '%', type: 'action' },
    { label: '÷', value: '/', type: 'operator' },
  ],
  [
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '×', value: '*', type: 'operator' },
  ],
  [
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '-', value: '-', type: 'operator' },
  ],
  [
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '+', value: '+', type: 'operator' },
  ],
  [
    { label: '0', value: '0', type: 'number', wide: true },
    { label: '.', value: '.', type: 'special' },
    { label: '=', value: '=', type: 'equals' },
  ],
]

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [expression, setExpression] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const calculate = useCallback(
    (a: number, b: number, op: string): number => {
      switch (op) {
        case '+':
          return a + b
        case '-':
          return a - b
        case '*':
          return a * b
        case '/':
          if (b === 0) throw new Error('Division by zero')
          return a / b
        default:
          return b
      }
    },
    []
  )

  const formatNumber = (num: number): string => {
    if (isNaN(num)) return 'Error'
    if (!isFinite(num)) return 'Error'
    const str = num.toString()
    if (str.length > 12) {
      return parseFloat(num.toPrecision(10)).toString()
    }
    return str
  }

  const handleNumber = useCallback(
    (value: string) => {
      if (waitingForOperand) {
        setDisplay(value)
        setWaitingForOperand(false)
      } else {
        setDisplay(display === '0' ? value : display + value)
      }
    },
    [display, waitingForOperand]
  )

  const handleDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }, [display, waitingForOperand])

  const handleOperator = useCallback(
    (op: string) => {
      const current = parseFloat(display)

      if (previousValue !== null && !waitingForOperand && operator) {
        try {
          const result = calculate(parseFloat(previousValue), current, operator)
          const formatted = formatNumber(result)
          setDisplay(formatted)
          setPreviousValue(formatted)
          setExpression(`${formatted} ${getOperatorSymbol(op)}`)
        } catch {
          setDisplay('Error')
          setPreviousValue(null)
          setOperator(null)
          setWaitingForOperand(true)
          setExpression('')
          return
        }
      } else {
        setPreviousValue(display)
        setExpression(`${display} ${getOperatorSymbol(op)}`)
      }

      setOperator(op)
      setWaitingForOperand(true)
    },
    [display, previousValue, operator, waitingForOperand, calculate]
  )

  const getOperatorSymbol = (op: string): string => {
    switch (op) {
      case '/':
        return '÷'
      case '*':
        return '×'
      default:
        return op
    }
  }

  const handleEquals = useCallback(() => {
    if (previousValue === null || operator === null) return

    const current = parseFloat(display)
    const prev = parseFloat(previousValue)

    try {
      const result = calculate(prev, current, operator)
      const formatted = formatNumber(result)
      const historyEntry = `${previousValue} ${getOperatorSymbol(operator)} ${display} = ${formatted}`
      setHistory((prev) => [historyEntry, ...prev.slice(0, 9)])
      setDisplay(formatted)
      setExpression(historyEntry)
      setPreviousValue(null)
      setOperator(null)
      setWaitingForOperand(true)
    } catch {
      setDisplay('Error')
      setPreviousValue(null)
      setOperator(null)
      setWaitingForOperand(true)
      setExpression('Error')
    }
  }, [display, previousValue, operator, calculate])

  const handleAction = useCallback(
    (action: string) => {
      switch (action) {
        case 'AC':
          setDisplay('0')
          setPreviousValue(null)
          setOperator(null)
          setWaitingForOperand(false)
          setExpression('')
          break
        case 'TOGGLE':
          if (display !== '0' && display !== 'Error') {
            setDisplay(
              display.startsWith('-') ? display.slice(1) : '-' + display
            )
          }
          break
        case '%':
          if (display !== 'Error') {
            const val = parseFloat(display) / 100
            setDisplay(formatNumber(val))
          }
          break
      }
    },
    [display]
  )

  const handleButtonClick = useCallback(
    (btn: ButtonConfig) => {
      switch (btn.type) {
        case 'number':
          handleNumber(btn.value)
          break
        case 'special':
          handleDecimal()
          break
        case 'operator':
          handleOperator(btn.value)
          break
        case 'equals':
          handleEquals()
          break
        case 'action':
          handleAction(btn.value)
          break
      }
    },
    [handleNumber, handleDecimal, handleOperator, handleEquals, handleAction]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleNumber(e.key)
      else if (e.key === '.') handleDecimal()
      else if (e.key === '+') handleOperator('+')
      else if (e.key === '-') handleOperator('-')
      else if (e.key === '*') handleOperator('*')
      else if (e.key === '/') {
        e.preventDefault()
        handleOperator('/')
      } else if (e.key === 'Enter' || e.key === '=') handleEquals()
      else if (e.key === 'Escape') handleAction('AC')
      else if (e.key === 'Backspace') {
        if (display.length > 1 && !waitingForOperand) {
          setDisplay(display.slice(0, -1))
        } else {
          setDisplay('0')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNumber, handleDecimal, handleOperator, handleEquals, handleAction, display, waitingForOperand])

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
      {/* Calculator */}
      <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden w-80 border border-gray-700">
        <Display value={display} expression={expression} />
        <div className="p-4 grid grid-cols-4 gap-3">
          {buttons.map((row, rowIndex) =>
            row.map((btn, colIndex) => (
              <Button
                key={`${rowIndex}-${colIndex}`}
                label={btn.label}
                type={btn.type}
                wide={btn.wide}
                onClick={() => handleButtonClick(btn)}
                isActive={operator === btn.value && waitingForOperand}
              />
            ))
          )}
        </div>
      </div>

      {/* History Panel */}
      {history.length > 0 && (
        <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden w-80 border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
              History
            </h2>
            <button
              onClick={() => setHistory([])}
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((entry, index) => (
              <div
                key={index}
                className="text-gray-300 text-sm bg-gray-800 rounded-lg px-3 py-2 font-mono"
              >
                {entry}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
