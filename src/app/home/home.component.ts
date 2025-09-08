import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Match, Round, TournamentBracket } from '../types';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

  public playersArray: string[] = [];
  public newPlayerName: string = '';
  public roundsArray: Round[] = [];


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

  public startTournament() {
    const bracket = this.generateTournamentBracket();

    sessionStorage.setItem('tournamentBracket', JSON.stringify(bracket));
    sessionStorage.setItem('playersArray', JSON.stringify(this.playersArray));

    this.router.navigate(['/tournament/run']);
  }

  private generateTournamentBracket(): TournamentBracket {
    const players: (string | null)[] = [...this.playersArray];

    // If odd number of players, add a bye
    if (players.length % 2 !== 0) {
      players.push(null);
    }

    const firstRoundMatches: Match[] = [];
    for (let i = 0; i < players.length; i += 2) {
      const player1 = players[i];
      const player2 = players[i + 1];

      if (player1 !== null && player2 !== null) {
        firstRoundMatches.push({
          player1,
          player2,
          winner: 0
        });
      } else if (player1 !== null || player2 !== null) {
        // Auto-advance the non-null player (bye)
        firstRoundMatches.push({
          player1,
          player2,
          winner: player1 ? 1 : 2
        });
      }
    }

    return {
      winners: [
        {
          roundNumber: 1,
          roundMatches: firstRoundMatches
        }
      ],
      losers: [] // losers’ bracket starts empty
    };
  }


  public startRoundRobin() {
    this.generateBracket();

    sessionStorage.setItem('roundsArray', JSON.stringify(this.roundsArray));
    sessionStorage.setItem('playersArray', JSON.stringify(this.playersArray));

    sessionStorage.removeItem('standingsArray');

    this.router.navigate(['/round-robin/run']);
  }

  public isStartButtonDisabled(): boolean {
    return this.playersArray.length < 2;
  }


  private clearNewPlayer() {
    this.newPlayerName = '';
  }

  private generateBracket() {
    let players: (string | null)[] = [...this.playersArray];

    // If odd number of players, add a "bye" slot
    if (players.length % 2 !== 0) {
      players.push(null);
    }

    const numRounds = players.length - 1;
    const half = players.length / 2;

    this.roundsArray = [];

    for (let round = 0; round < numRounds; round++) {
      const roundMatches: Match[] = [];

      for (let i = 0; i < half; i++) {
        const player1 = players[i];
        const player2 = players[players.length - 1 - i];

        // Skip bye matches
        if (player1 !== null && player2 !== null) {
          roundMatches.push({
            player1,
            player2,
            winner: 0
          });
        }
      }

      // Save the round with its matches
      this.roundsArray.push({
        roundNumber: round + 1,
        roundMatches
      });

      // Rotate players (keep first fixed)
      players = [
        players[0],
        ...players.slice(-1),
        ...players.slice(1, -1)
      ];
    }
  }


  public createTestPlayers(isOdd: boolean) {
    const testArray = [
      'Kody', 'Stone', 'Jacob', 'Fred', 'Charles', 'lorem', 'ipsum', 'times', 'new', 'roman', 'test', 'test1', 'montech', 'razr', 'stapl', 'google'
    ]

    if (isOdd) {
      testArray.pop();
    }

    this.playersArray = testArray;
  }
}
