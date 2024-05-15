interface ProbabilityResult {
    myWinProbabilityPartial: number;
    allPlayersWinProbabilityPartial: number[];
    myWinProbabilityFull: number;
    allPlayersWinProbabilityFull: number[];
  }
  
  export const calculateWinProbability = (
    myHand: string[],
    numPlayers: number,
    allHands: string[][],
    deck: string[]
  ): ProbabilityResult => {
    // 部分情報勝率の計算用（モンテカルロシミュレーション等）
  
    // 完全情報での勝率計算
    const communityCards: string[] = [];
    for (let i = 0; i < 5; i++) {
      const card = deck.pop();
      if (!card) throw new Error("Not enough cards in the deck");
      communityCards.push(card);
    }
  
    const fullInfoWinProbabilities = evaluateHandsWithFullInformation(allHands, communityCards);
  
    return {
      myWinProbabilityPartial: 0, // 本来は計算が必要
      allPlayersWinProbabilityPartial: [], // 本来は計算が必要
      myWinProbabilityFull: fullInfoWinProbabilities[0],
      allPlayersWinProbabilityFull: fullInfoWinProbabilities
    };
  };
  
  const evaluateHandsWithFullInformation = (allHands: string[][], communityCards: string[]): number[] => {
    // 完全情報に基づく勝率の計算
    const scores = allHands.map(hand => evaluateHand(hand.concat(communityCards)));
    const maxScore = Math.max(...scores);
    const winnersCount = scores.filter(score => score === maxScore).length;
    const winProbability = 100 / winnersCount;
    return scores.map(score => score === maxScore ? winProbability : 0);
  };
  
  const evaluateHand = (hand: string[]): number => {
    // ハンド評価関数（簡略化されたバージョン）
    const ranks = '23456789TJQKA';
    const rankCounts = hand.reduce((counts, card) => {
      const rank = card[0];
      counts[rank] = (counts[rank] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });
  
    return Object.values(rankCounts).reduce((score, count) => score + count ** 2, 0);
  };
  