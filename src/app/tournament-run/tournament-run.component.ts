import { Component, OnInit } from '@angular/core';
import { Match, Round, TournamentBracket } from '../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tournament-run',
  imports: [],
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


  public setWinner(bracket: 'W' | 'L', roundIndex: number, matchIndex: number, winner: 0 | 1 | 2) {
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
    const matchWinner: string = this.getWinner(match);
    if (bracket === 'L') {
      // progress winner only

      if (this.tournamentBracket.losers.length < roundIndex + 2) {
        // this is the first winner sent to this round, need to create the match for this round and just return 
        this.tournamentBracket.losers.push({
          roundNumber: roundIndex + 2,
          roundMatches: [{ player1: matchWinner, player2: null, winner: 0 }]
        });
        // no additional steps needed
        return;
      }

      // create a mutable copy of the round we are working with
      let tempRound = this.tournamentBracket.losers[roundIndex + 1].roundMatches

      // get the modified round from insertPlayer() and then write that entire tempRound back to the bracket
      tempRound = this.insertPlayer(tempRound, matchWinner);
      this.tournamentBracket.losers[roundIndex + 1].roundMatches = tempRound;
    } else {
      // progress loser and winner

    }


    // keep bracket persisted over time
    sessionStorage.setItem('tournamentBracket', JSON.stringify(this.tournamentBracket));

  }

  private insertPlayer(tempRound: Match[], matchWinner: string): Match[] {
    // push winners to the next round in order they appear, only moving to the next Match if both player1 and 2 are filled in
    // unfilled spot is null
    let insertedPlayer: boolean = false; //inspect after the loop to see if there was a spot to insert, if not we need to add a match
    for (const tempMatch of tempRound) {
      if (tempMatch.player1 === null) {
        tempMatch.player1 = matchWinner;
        insertedPlayer = true;
        return tempRound;
      } else if (tempMatch.player2 === null) {
        tempMatch.player2 = matchWinner;
        insertedPlayer = true;
        return tempRound;
      }
      // else move on because this match is full
    }

    if (!insertedPlayer) {
      // add a new match object
      tempRound.push({ player1: matchWinner, player2: null, winner: 0 })
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
