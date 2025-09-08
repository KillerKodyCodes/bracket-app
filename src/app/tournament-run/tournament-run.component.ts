import { Component, OnInit } from '@angular/core';
import { Match, Round, TournamentBracket } from '../types';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tournament-run',
  imports: [FormsModule],
  templateUrl: './tournament-run.component.html',
  styleUrl: './tournament-run.component.css'
})
export class TournamentRunComponent {

  public playersArray: string[] = [];
  public tournamentBracket: TournamentBracket;

  constructor(private router: Router) {
    // Load from session storage
    this.playersArray = JSON.parse(sessionStorage.getItem('playersArray') || '[]');
    this.tournamentBracket = JSON.parse(sessionStorage.getItem('tournamentBracket') || 'null');

    // If missing required data, redirect back home
    if (!this.tournamentBracket || this.playersArray.length < 2) {
      console.warn('Missing bracket or not enough players, redirecting...');
      this.router.navigate(['/']);
      return;
    }

    // Debug logs
    console.log('Players:', this.playersArray);
    console.log('Tournament Bracket:', this.tournamentBracket);

  };


  public setWinner(bracket: 'W' | 'L', roundIndex: number, matchIndex: number, event: Event) {
    const winner = Number((event.target as HTMLSelectElement).value);
    let workingBracket: Round[] | undefined;
    if (bracket === 'W') {
      workingBracket = this.tournamentBracket?.winners
    } else if (bracket === 'L') {
      workingBracket = this.tournamentBracket?.losers
    } else {
      throw new Error('invalid bracket type', bracket);
    }

    // handled undefined if bracket never populated
    if (workingBracket === undefined) {
      throw new Error('Bracket is undefined');
    }
    const match = workingBracket[roundIndex].roundMatches[matchIndex];

    // If it’s a bye (null player), auto-assign the winner
    if (match.player1 === null && match.player2 !== null) {
      match.winner = 2;
    } else if (match.player2 === null && match.player1 !== null) {
      match.winner = 1;
    } else {
      match.winner = winner; // normal case
    }

    // then need to update the affected bracket(s)
    this.progressBracket(bracket, roundIndex, match);
  }

  private progressBracket(bracket: 'W' | 'L', roundIndex: number, match: Match) {
    const matchWinner = this.getWinner(match);
    const matchLoser = match.player1 === matchWinner ? match.player2 : match.player1;

    if (bracket === 'W') {
      const nextWinnersRoundIndex = roundIndex + 1;
      const losersRoundIndex = roundIndex;

      // Advance winner in winners bracket
      this.advancePlayerInBracket(this.tournamentBracket.winners, nextWinnersRoundIndex, matchWinner);

      // Advance loser in losers bracket
      if (matchLoser !== null) {
        this.advancePlayerInBracket(this.tournamentBracket.losers, losersRoundIndex, matchLoser);
      }

    } else if (bracket === 'L') {
      const nextLosersRoundIndex = roundIndex + 1;
      this.advancePlayerInBracket(this.tournamentBracket.losers, nextLosersRoundIndex, matchWinner);
    }

    // Persist bracket
    sessionStorage.setItem('tournamentBracket', JSON.stringify(this.tournamentBracket));
  }

  /** Helper to advance a player to the next round in a given bracket */
  private advancePlayerInBracket(bracketArray: Round[], roundIndex: number, player: string) {
    // Create the round if it doesn't exist
    if (!bracketArray[roundIndex]) {
      bracketArray[roundIndex] = {
        roundNumber: roundIndex + 1,
        roundMatches: []
      };
    }

    // Insert player into next available slot
    bracketArray[roundIndex].roundMatches = this.insertPlayer(bracketArray[roundIndex].roundMatches, player);
  }



  private insertPlayer(tempRound: Match[], player: string): Match[] {
    // push winners to the next round in order they appear, only moving to the next Match if both player1 and 2 are filled in
    // unfilled spot is null
    let insertedPlayer: boolean = false; //inspect after the loop to see if there was a spot to insert, if not we need to add a match
    for (const tempMatch of tempRound) {
      if (tempMatch.player1 === null) {
        tempMatch.player1 = player;
        insertedPlayer = true;
        return tempRound;
      } else if (tempMatch.player2 === null) {
        tempMatch.player2 = player;
        insertedPlayer = true;
        return tempRound;
      }
      // else move on because this match is full
    }

    if (!insertedPlayer) {
      // add a new match object
      tempRound.push({ player1: player, player2: null, winner: 0 })
    }

    return tempRound;

  }

  private getWinner(match: Match): string {
    // If one side is null, auto-win for the other side
    if (match.player1 !== null && match.player2 === null) {
      return match.player1;
    }
    if (match.player2 !== null && match.player1 === null) {
      return match.player2;
    }

    // Otherwise, require a manual winner
    if (match.winner === 1 && match.player1 !== null) {
      return match.player1;
    }
    if (match.winner === 2 && match.player2 !== null) {
      return match.player2;
    }
    throw new Error(`Unable to determine winner for match: ${match.player1} vs ${match.player2}`);
  }

}
