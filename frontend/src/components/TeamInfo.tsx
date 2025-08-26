function TeamInfo({ team, isHome = false }: TeamInfoProps) {
  return (
    <div className={`flex items-center space-x-4 ${!isHome ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <img 
        src={`/images/teams/${team.logo}`} 
        alt={team.title}
        className="w-8 h-8 object-contain"
        onError={(e) => {
          e.currentTarget.src = '/images/teams/default.png'
        }}
      />
      <span className="font-semibold">{team.title}</span>
    </div>
  )
}

export default TeamInfo