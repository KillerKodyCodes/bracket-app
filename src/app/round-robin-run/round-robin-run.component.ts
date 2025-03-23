import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface match {
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
  imports: [FormsModule],
  templateUrl: './round-robin-run.component.html',
  styleUrl: './round-robin-run.component.css'
})
export class RoundRobinRunComponent implements OnInit {

  private playersArray: string[] = [];
  public matchesArray: match[] = [];
  public standingsArray: standingsObject[] = [];
  constructor(private router: Router) { };


  ngOnInit(): void {
    this.matchesArray = JSON.parse(sessionStorage.getItem('matchesArray') || '[]');
    this.playersArray = JSON.parse(sessionStorage.getItem('playersArray') || '[]');
    this.standingsArray = JSON.parse(sessionStorage.getItem('standingsArray') || '[]');

    if (this.matchesArray.length < 1 || this.playersArray.length < 2) {
      this.router.navigate(['/round-robin']);
    }

    //will pickup the persisted standings if possible, if not present then initialize
    if (this.standingsArray.length < 1) {
      this.initializeStandings();
    }

  }

  public setWinner(roundNumber: number, event: Event) {
    const winnerValue = Number((event.target as HTMLSelectElement).value);
    const validWinnerValues = [0, 1, 2];

    if (!validWinnerValues.includes(winnerValue)) {
      console.error('Value of', winnerValue, 'not a valid winner value.');
      return;
    }

    const round = this.matchesArray[roundNumber];

    round.winner = winnerValue;
    //make sure session storage has the latest changes.
    sessionStorage.setItem('matchesArray', JSON.stringify(this.matchesArray));

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

    //keep session storage updated
    sessionStorage.setItem('standingsArray', JSON.stringify(this.standingsArray));
  }

  private initializeStandings() {
    for (const player of this.playersArray) {
      this.standingsArray.push({ player: player, points: 0 });
    }
  }


}
