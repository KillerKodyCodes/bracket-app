import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-round-robin-home',
  imports: [FormsModule],
  templateUrl: './round-robin-home.component.html',
  styleUrl: './round-robin-home.component.css'
})

export class RoundRobinHomeComponent {

  public playersArray: string[] = [];
  public newPlayerName: string = '';

  constructor() { }


  public addPlayer() {
    if (this.newPlayerName.length !== 0) {
      this.playersArray.push(this.newPlayerName);
    }
    this.clearNewPlayer();
  }

  public addPlayerButtonDisabled(): boolean {
    return this.newPlayerName.length < 1;
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


  private clearNewPlayer() {
    this.newPlayerName = '';
  }

}
