function Header({ title }: HeaderProps) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <img src="/images/logo.jpg" alt="logo" width={300} height={300} />
    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
      {title}  - Super Lig Betting Center
    </h1>
    </div>
  )
}

export default Header