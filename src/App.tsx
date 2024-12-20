import { useState, useEffect } from 'react'

function App() {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('highScore')
    return saved ? parseInt(saved) : 0
  })
  const [cards, setCards] = useState<number[]>([])
  const [isRevealed, setIsRevealed] = useState<boolean>(false)
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [allCardsRevealed, setAllCardsRevealed] = useState<boolean>(false)

  // Shuffle cards and start new round
  const shuffleCards = () => {
    const losingCard = Math.floor(Math.random() * 4)
    const newCards = Array(4).fill(0).map((_, index) => (index === losingCard ? 0 : 1))
    setCards(newCards)
    setIsRevealed(false)
    setSelectedCard(null)
    setAllCardsRevealed(false)
  }

  // Start the game
  useEffect(() => {
    shuffleCards()
  }, [])

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('highScore', score.toString())
    }
  }, [score, highScore])

  // Card selection handler
  const handleCardSelect = (index: number) => {
    if (isRevealed || selectedCard !== null) return
    
    setSelectedCard(index)
    setIsRevealed(true)
    setAllCardsRevealed(true)

    if (cards[index] === 1) {
      // Won
      setScore(score + 1)
      setTimeout(() => {
        setAllCardsRevealed(false)
        shuffleCards()
      }, 2000)
    } else {
      // Lost
      setGameStatus('lost')
    }
  }

  return (
    <main className="min-h-screen p-4 flex flex-col items-center justify-center bg-gray-900">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Card Game</h1>
        <div className="flex gap-8 justify-center">
          <p className="text-2xl text-white">Round: {score}</p>
          <p className="text-2xl text-yellow-400">High Score: {highScore}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardSelect(index)}
            className={`
              aspect-square cursor-pointer transform transition-all duration-300
              ${selectedCard === index ? 'animate-flip' : ''}
              ${!isRevealed ? 'hover:scale-105' : ''}
            `}
          >
            <div className={`
              w-full h-full rounded-xl flex items-center justify-center text-white text-2xl font-bold
              ${(isRevealed && selectedCard === index) || allCardsRevealed
                ? card === 1
                  ? 'bg-green-500'
                  : 'bg-red-500'
                : 'bg-blue-600 hover:bg-blue-700'}
            `}>
              {(isRevealed && selectedCard === index) || allCardsRevealed ? (
                card === 1 ? '✓' : '×'
              ) : '?'}
            </div>
          </div>
        ))}
      </div>

      {gameStatus === 'lost' && (
        <div className="mt-8 text-center">
          <p className="text-2xl text-red-500 font-bold mb-2">Game Over!</p>
          <p className="text-xl text-white mb-4">
            Total Rounds: {score}
            {score === highScore && score > 0 && <span className="text-yellow-400 ml-2">New Record! 🏆</span>}
          </p>
          <button
            onClick={() => {
              setScore(0)
              setGameStatus('playing')
              setAllCardsRevealed(false)
              shuffleCards()
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </main>
  )
}

export default App 