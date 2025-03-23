import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { match } from '../round-robin-run/round-robin-run.component';

@Component({
  selector: 'app-round-robin-home',
  imports: [FormsModule],
  templateUrl: './round-robin-home.component.html',
  styleUrl: './round-robin-home.component.css'
})

export class RoundRobinHomeComponent {

  public playersArray: string[] = [];
  public newPlayerName: string = '';
  public matchesArray: match[] = [];

  constructor(private router: Router) { }


  public addPlayer() {
    if (this.newPlayerName.trim().length !== 0) {
      this.playersArray.push(this.newPlayerName);
    }
    this.clearNewPlayer();
  }

  public addPlayerButtonDisabled(): boolean {
    return this.newPlayerName.trim().length < 1;
  }

  public removePlayer(index: number) {
    this.playersArray.splice(index, 1);
  }

  public clearPlayers() {
    this.playersArray = [];
  }

  public isClearPlayersButtonDisabled(): boolean {
    return this.playersArray.length < 1;
  }

  public startRoundRobin() {
    //prepare the matches array before starting the round robin
    this.generateBracket();

    sessionStorage.setItem('matchesArray', JSON.stringify(this.matchesArray));
    sessionStorage.setItem('playersArray', JSON.stringify(this.playersArray));
    //standings are handled on the run component only, need to empty it if the start button is clicked on the home component
    sessionStorage.removeItem('standingsArray');

    this.router.navigate(['/round-robin/run'], {
      state: { matchesArray: this.matchesArray, playersArray: this.playersArray }
    });
  }

  public isStartRoundRobinButtonDisabled(): boolean {
    return this.playersArray.length < 2;
  }


  private clearNewPlayer() {
    this.newPlayerName = '';
  }

  private generateBracket() {
    for (const player1 of this.playersArray) {
      for (const player2 of this.playersArray) {
        if (player1 !== player2) {
          const roundData: match = {
            player1: player1,
            player2: player2,
            winner: 0
          }

          if (!this.isDuplicateRound(roundData)) {
            this.matchesArray.push(roundData);
          }

        }
      }
    }

    this.balanceBracket();
  }

  private balanceBracket() {
    let balanced = false;

    // Try multiple passes to reduce repeated player sequences
    for (let attempt = 0; attempt < 10 && !balanced; attempt++) {
      balanced = true;

      for (let i = 0; i < this.matchesArray.length - 1; i++) {
        const current = this.matchesArray[i];
        const next = this.matchesArray[i + 1];

        // If the same player appears consecutively, swap with a non-adjacent match
        if (
          current.player1 === next.player1 || current.player2 === next.player2 ||
          current.player1 === next.player2 || current.player2 === next.player1
        ) {
          // Find a non-adjacent match to swap
          let swapIndex = i + 2;
          while (swapIndex < this.matchesArray.length) {
            const swapCandidate = this.matchesArray[swapIndex];
            if (
              swapCandidate.player1 !== current.player1 &&
              swapCandidate.player2 !== current.player2 &&
              swapCandidate.player1 !== next.player1 &&
              swapCandidate.player2 !== next.player2
            ) {
              // Swap and mark it as balanced attempt
              [this.matchesArray[i + 1], this.matchesArray[swapIndex]] =
                [this.matchesArray[swapIndex], this.matchesArray[i + 1]];
              balanced = false;
              break;
            }
            swapIndex++;
          }
        }
      }
    }
  }

  private isDuplicateRound(roundToInsert: match) {
    return this.matchesArray.some((round) => {
      if ((round.player1 === roundToInsert.player1 && round.player2 === roundToInsert.player2) || (round.player1 === roundToInsert.player2 && round.player2 === roundToInsert.player1)) {
        return true;
      }
      return false;
    }
    )
  }



}
