import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Match, Round, Standings } from '../types';



@Component({
  selector: 'app-round-robin-run',
  imports: [FormsModule],
  templateUrl: './round-robin-run.component.html',
  styleUrl: './round-robin-run.component.css'
})
export class RoundRobinRunComponent implements OnInit {

  private playersArray: string[] = [];
  public roundsArray: Round[] = [];
  public standingsArray: Standings[] = [];
  constructor(private router: Router) { };


  ngOnInit(): void {
    this.playersArray = JSON.parse(sessionStorage.getItem('playersArray') || '[]');
    this.standingsArray = JSON.parse(sessionStorage.getItem('standingsArray') || '[]');
    this.roundsArray = JSON.parse(sessionStorage.getItem('roundsArray') || '[]');

    if (this.roundsArray.length < 1 || this.playersArray.length < 2) {
      this.router.navigate(['/round-robin']);
    }

    //will pickup the persisted standings if possible, if not present then initialize
    if (this.standingsArray.length < 1) {
      this.initializeStandings();
    }

  }

  public setWinner(roundIndex: number, matchIndex: number, event: Event) {
    const winnerValue = Number((event.target as HTMLSelectElement).value);
    const validWinnerValues = [0, 1, 2]; // 0 = no winner, 1 = player1, 2 = player2

    if (!validWinnerValues.includes(winnerValue)) {
      console.error('Value of', winnerValue, 'not a valid winner value.');
      return;
    }

    const round = this.roundsArray[roundIndex];
    const match = round.roundMatches[matchIndex];
    match.winner = winnerValue;

    // Persist updated rounds
    sessionStorage.setItem('roundsArray', JSON.stringify(this.roundsArray));

    // Update standings
    if (winnerValue === 1) {
      this.updatePlayerPoints(match.player1, 1);
    } else if (winnerValue === 2) {
      this.updatePlayerPoints(match.player2, 1);
    }
  }

  private updatePlayerPoints(player: string | null, change: number) {
    if (player === null) {
      // Bye round → no points
      return;
    }

    const playerIndex = this.standingsArray.findIndex(p => p.player === player);

    if (playerIndex !== -1) {
      this.standingsArray[playerIndex].points += change;
    }

    this.sortStandings();
  }

  private sortStandings() {
    this.standingsArray.sort((a, b) => b.points - a.points);

    //keep session storage updated
    sessionStorage.setItem('standingsArray', JSON.stringify(this.standingsArray));
  }

  private initializeStandings() {
    for (const player of this.playersArray) {
      this.standingsArray.push({ player: player, points: 0 });
    }
  }


}
