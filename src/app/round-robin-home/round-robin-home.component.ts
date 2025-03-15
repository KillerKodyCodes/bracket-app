import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-round-robin-home',
  imports: [FormsModule],
  templateUrl: './round-robin-home.component.html',
  styleUrl: './round-robin-home.component.css'
})

export class RoundRobinHomeComponent {

  public playersArray: string[] = [];
  public newPlayerName: string = '';

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
    this.router.navigate(['/round-robin/run'], {
      state: { playersArray: this.playersArray }
    });
  }

  isStartRoundRobinButtonDisabled(): boolean {
    return this.playersArray.length < 2;
  }


  private clearNewPlayer() {
    this.newPlayerName = '';
  }

}
