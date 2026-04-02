'use client'

type ButtonProps = {
  label: string
  type: 'number' | 'operator' | 'action' | 'equals' | 'special'
  wide?: boolean
  isActive?: boolean
  onClick: () => void
}

export default function Button({
  label,
  type,
  wide = false,
  isActive = false,
  onClick,
}: ButtonProps) {
  const getBaseStyles = (): string => {
    const base =
      'flex items-center justify-center rounded-full font-medium text-lg cursor-pointer select-none transition-all duration-100 active:scale-95 h-16'

    if (wide) return `${base} col-span-2`
    return base
  }

  const getColorStyles = (): string => {
    if (type === 'action') {
      return 'bg-gray-500 hover:bg-gray-400 text-black'
    }
    if (type === 'operator') {
      if (isActive) {
        return 'bg-white text-orange-500 hover:bg-gray-200'
      }
      return 'bg-orange-500 hover:bg-orange-400 text-white'
    }
    if (type === 'equals') {
      return 'bg-orange-500 hover:bg-orange-400 text-white'
    }
    if (type === 'special') {
      return 'bg-gray-700 hover:bg-gray-600 text-white'
    }
    // number
    return 'bg-gray-700 hover:bg-gray-600 text-white'
  }

  return (
    <button
      onClick={onClick}
      className={`${getBaseStyles()} ${getColorStyles()} shadow-md`}
      aria-label={label}
    >
      {label}
    </button>
  )
}
