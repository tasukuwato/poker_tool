import React, { useState } from 'react';

const suits = ['♠', '♥', '♦', '♣'];
const ranks = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
];

const createDeck = () => {
  const deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push(`${rank}${suit}`);
    }
  }
  return deck;
};

const shuffleDeck = (deck: string[]) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const ParameterSettings: React.FC = () => {
  const [initialChips, setInitialChips] = useState(1000);
  const [ante, setAnte] = useState(10);
  const [position, setPosition] = useState(1);
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState<string[][]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startSimulation();
  };

  const startSimulation = () => {
    let deck = createDeck();
    deck = shuffleDeck(deck);

    const playerHands: string[][] = [];
    for (let i = 0; i < numPlayers; i++) {
      playerHands.push([deck.pop()!, deck.pop()!]);
    }

    setPlayers(playerHands);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Initial Chips:
            <input
              type="number"
              value={initialChips}
              onChange={(e) => setInitialChips(Number(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            Ante:
            <input
              type="number"
              value={ante}
              onChange={(e) => setAnte(Number(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            Position:
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            Number of Players:
            <input
              type="number"
              min="2"
              max="10"
              value={numPlayers}
              onChange={(e) => setNumPlayers(Number(e.target.value))}
            />
          </label>
        </div>
        <button type="submit">Start Simulation</button>
      </form>
      <div>
        <h2>Player Hands</h2>
        {players.map((hand, index) => (
          <div key={index}>
            {index === 0 ? 'You' : `Player ${index + 1}`}: {hand.join(', ')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParameterSettings;
