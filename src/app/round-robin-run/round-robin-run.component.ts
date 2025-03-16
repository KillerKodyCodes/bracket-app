import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
export interface round {
  player1: string;
  player2: string;
  winner: number;
}

export interface standingsObject {
  player: string;
  points: number;
}

@Component({
  selector: 'app-round-robin-run',
  imports: [],
  templateUrl: './round-robin-run.component.html',
  styleUrl: './round-robin-run.component.css'
})
export class RoundRobinRunComponent implements OnInit {

  private playersArray: string[] = [];
  public roundsArray: round[] = [];
  public standingsArray: standingsObject[] = [];
  constructor(private router: Router) { };


  ngOnInit(): void {
    this.playersArray = history.state.playersArray || [];

    if (this.playersArray.length < 2) {
      this.router.navigate(['/round-robin']);
    }

    this.generateBracket();
    this.initializeStandings();

  }

  generateBracket() {
    for (const player1 of this.playersArray) {
      for (const player2 of this.playersArray) {
        if (player1 !== player2) {
          const roundData: round = {
            player1: player1,
            player2: player2,
            winner: 0
          }

          if (!this.isDuplicateRound(roundData)) {
            this.roundsArray.push(roundData);
          }

        }
      }
    }

    console.log(this.roundsArray);

    this.balanceBracket();
  }

  private isDuplicateRound(roundToInsert: round) {
    return this.roundsArray.some((round) => {
      if ((round.player1 === roundToInsert.player1 && round.player2 === roundToInsert.player2) || (round.player1 === roundToInsert.player2 && round.player2 === roundToInsert.player1)) {
        return true;
      }
      return false;
    }
    )
  }

  public setWinner(roundNumber: number, event: Event) {
    const winnerValue = Number((event.target as HTMLSelectElement).value);
    const validWinnerValues = [0, 1, 2];

    if (!validWinnerValues.includes(winnerValue)) {
      console.error('Value of', winnerValue, 'not a valid winner value.');
      return;
    }

    const round = this.roundsArray[roundNumber];

    round.winner = winnerValue;

    if (winnerValue === 1) {
      this.updatePlayerPoints(round.player1, 1);
    } else if (winnerValue === 2) {
      this.updatePlayerPoints(round.player2, 1);
    }

  }


  private updatePlayerPoints(player: string, change: number) {
    const playerIndex = this.standingsArray.findIndex(p => p.player === player);

    if (playerIndex !== -1) {
      this.standingsArray[playerIndex].points += change;
    }
    this.sortStandings();

  }

  private sortStandings() {
    this.standingsArray.sort((a, b) => b.points - a.points);
  }

  private initializeStandings() {
    for (const player of this.playersArray) {
      this.standingsArray.push({ player: player, points: 0 });
    }
  }



  private balanceBracket() {
    let balanced = false;

    // Try multiple passes to reduce repeated player sequences
    for (let attempt = 0; attempt < 10 && !balanced; attempt++) {
      balanced = true;

      for (let i = 0; i < this.roundsArray.length - 1; i++) {
        const current = this.roundsArray[i];
        const next = this.roundsArray[i + 1];

        // If the same player appears consecutively, swap with a non-adjacent match
        if (
          current.player1 === next.player1 || current.player2 === next.player2 ||
          current.player1 === next.player2 || current.player2 === next.player1
        ) {
          // Find a non-adjacent match to swap
          let swapIndex = i + 2;
          while (swapIndex < this.roundsArray.length) {
            const swapCandidate = this.roundsArray[swapIndex];
            if (
              swapCandidate.player1 !== current.player1 &&
              swapCandidate.player2 !== current.player2 &&
              swapCandidate.player1 !== next.player1 &&
              swapCandidate.player2 !== next.player2
            ) {
              // Swap and mark it as balanced attempt
              [this.roundsArray[i + 1], this.roundsArray[swapIndex]] =
                [this.roundsArray[swapIndex], this.roundsArray[i + 1]];
              balanced = false;
              break;
            }
            swapIndex++;
          }
        }
      }
    }
  }


}
