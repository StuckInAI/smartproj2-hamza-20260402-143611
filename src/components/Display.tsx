'use client'

type DisplayProps = {
  value: string
  expression: string
}

export default function Display({ value, expression }: DisplayProps) {
  const getFontSize = (val: string): string => {
    if (val.length <= 6) return 'text-5xl'
    if (val.length <= 9) return 'text-4xl'
    if (val.length <= 12) return 'text-3xl'
    return 'text-2xl'
  }

  return (
    <div className="bg-gray-900 px-6 pt-6 pb-4 text-right">
      {/* Expression / History line */}
      <div className="h-6 mb-2">
        <p className="text-gray-500 text-sm truncate">
          {expression || '\u00A0'}
        </p>
      </div>

      {/* Main display */}
      <div
        className={`font-light text-white tracking-tight transition-all duration-150 ${
          getFontSize(value)
        } ${value === 'Error' ? 'text-red-400' : ''}`}
      >
        {value}
      </div>
    </div>
  )
}
