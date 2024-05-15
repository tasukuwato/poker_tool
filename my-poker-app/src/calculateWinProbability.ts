// src/calculateWinProbability.ts
type ProbabilityResult = {
    myWinProbabilityPartial: number;
    allPlayersWinProbabilityPartial: number[];
    myWinProbabilityFull: number;
    allPlayersWinProbabilityFull: number[];
  };
  
  export const calculateWinProbability = (
    myHand: string[],
    numPlayers: number,
    allHands: string[][],
    deck: string[]
  ): ProbabilityResult => {
    const simulations = 10000;
    let myWinsPartial = 0;
    let allPlayerWinsPartial = Array(numPlayers).fill(0);
    let myWinsFull = 0;
    let allPlayerWinsFull = Array(numPlayers).fill(0);
  
    for (let i = 0; i < simulations; i++) {
      let tempDeck: string[] = [...deck];
      const communityCards: string[] = [];
  
      // Draw 5 community cards
      for (let j = 0; j < 5; j++) {
        const cardIndex = Math.floor(Math.random() * tempDeck.length);
        communityCards.push(tempDeck.splice(cardIndex, 1)[0]);
      }
  
      // Generate hands for each player
      const playerHandsPartial: string[][] = [myHand];
      for (let j = 1; j < numPlayers; j++) {
        const hand: string[] = [];
        for (let k = 0; k < 2; k++) {
          const cardIndex = Math.floor(Math.random() * tempDeck.length);
          hand.push(tempDeck.splice(cardIndex, 1)[0]);
        }
        playerHandsPartial.push(hand);
      }
  
      // Full information hands
      const playerHandsFull: string[][] = allHands.map(hand => [...hand]);
  
      const scoresPartial = playerHandsPartial.map((hand) => evaluateHand(hand.concat(communityCards)));
      const scoresFull = playerHandsFull.map((hand) => evaluateHand(hand.concat(communityCards)));
      
      const maxScorePartial = Math.max(...scoresPartial);
      const maxScoreFull = Math.max(...scoresFull);
  
      const winningIndicesPartial = scoresPartial.map((score, index) => (score === maxScorePartial ? index : -1)).filter(index => index !== -1);
      const winningIndicesFull = scoresFull.map((score, index) => (score === maxScoreFull ? index : -1)).filter(index => index !== -1);
  
      if (winningIndicesPartial.includes(0)) {
        myWinsPartial++;
      }
      if (winningIndicesFull.includes(0)) {
        myWinsFull++;
      }
  
      winningIndicesPartial.forEach(index => {
        allPlayerWinsPartial[index]++;
      });
      winningIndicesFull.forEach(index => {
        allPlayerWinsFull[index]++;
      });
    }
  
    const myWinProbabilityPartial = (myWinsPartial / simulations) * 100;
    const allPlayersWinProbabilityPartial = allPlayerWinsPartial.map(wins => (wins / simulations) * 100);
    const myWinProbabilityFull = (myWinsFull / simulations) * 100;
    const allPlayersWinProbabilityFull = allPlayerWinsFull.map(wins => (wins / simulations) * 100);
  
    return {
      myWinProbabilityPartial,
      allPlayersWinProbabilityPartial,
      myWinProbabilityFull,
      allPlayersWinProbabilityFull
    };
  };
  
  const evaluateHand = (hand: string[]): number => {
    // Simple evaluation function for demonstration purposes
    // Replace with a full hand evaluation algorithm
    const ranks = '23456789TJQKA';
    const rankCounts = hand.reduce((counts, card) => {
      const rank = card[0];
      counts[rank] = (counts[rank] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });
  
    return Object.values(rankCounts).reduce((score, count) => score + count ** 2, 0);
  };
  