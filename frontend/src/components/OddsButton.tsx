function OddsButton({ betType, odds, label, isSelected, onClick }: OddsButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border-2 transition-colors ${
        isSelected
          ? 'border-green-500 bg-green-50 text-green-700'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="font-semibold">{betType}</div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-bold">{odds}</div>
    </button>
  )
}

export default OddsButton