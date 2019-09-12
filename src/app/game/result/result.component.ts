import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../session.service';
import { Router } from '@angular/router';
import UIkit from 'uikit';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  get secondVariant(): boolean {
    return this._secondVariant;
  }
  get cashbackAmount(): number {
    return this._cashbackAmount;
  }
  get rightAnswerCount(): number {
    return this._rightAnswerCount;
  }
  get gamesPlayed(): number {
    return this._gamesPlayed;
  }
  
  
  
  private _firstTime = false;
  public _gamesPlayed = 2;
  private _rightAnswerCount = 10;
  private _cashbackAmount = 0;
  private _secondVariant = true;
  private _firstGameEver = true;
  private _firstGameToday = true;
  private _isInTop = true;
  private _bestWeekScore = 0;
  
  constructor( private session: SessionService, private router: Router ) { }

  ngOnInit() {
    if (!this.session.lastGameResults)
      this.router.navigate(['home']);
      
    this._rightAnswerCount = this.session.lastGameResults.correctAnswers;
    this._cashbackAmount = this.session.lastGameResults.cashbackWon || 0;
    this._firstTime = this.session.gamesPlayed == 1;
    this._gamesPlayed = this.session.gamesPlayed;
    this._bestWeekScore = this.session.lastGameResults.isBestScoreLastWeek;
    this._isInTop = this.session.lastGameResults.isTop100;
    
    // Check Best Score Today
    var bestScore = this.session.user.bestScore;
    var bestScoreToday = this.session.user.bestScoreToday;
    if(this._rightAnswerCount > bestScoreToday)
      this.session.user.bestScoreToday = this._rightAnswerCount
    if(this._rightAnswerCount > bestScore)
      this.session.user.bestScore = this._rightAnswerCount
    
    console.log("Games Played: "+ this._gamesPlayed);
    console.log("cashBack Won: "+ this._cashbackAmount);
    
    var modal = UIkit.modal("#result");
    setTimeout( () => { modal.show(); }, 1000 );
      
  }
  
  startGame() {
    // if(this._gamesPlayed >= 3) {
    //   // popup modal with error
    //   this.router.navigate(['returnhome']);
      
    // }else{
      console.log("Play Main Game!");
      this.session.gamesPlayed++;
       this.router.navigate(['game']);
    // }
  }
  
  returnHome() {
    this.router.navigate(['returnhome']);
  }
  
  startFreeGame() {
    this.router.navigate(['freetimegame']);
  }
  
  get TopText(): string {
    if(this._rightAnswerCount == 0)
      return "Oops…"
    if(this._rightAnswerCount == 1)
      return "Just…"
    if(this._rightAnswerCount >= 2 && this._rightAnswerCount <= 4)
      return "Good!"
    if(this._rightAnswerCount >= 5 && this._rightAnswerCount <= 9)
      return "Very Good!"
    if(this._rightAnswerCount >= 10)
      return "Perfect!"
  }
  
  get answerMessage(): string {
    if(this._rightAnswerCount == 0)
      return "Correct Answers"
    if(this._rightAnswerCount == 1)
      return "Correct Answer"
    if(this._rightAnswerCount >= 2 && this._rightAnswerCount <= 4)
      return "Correct Answers"
    if(this._rightAnswerCount >= 5 )
      return "Correct Answers"
    // if(this._rightAnswerCount >= 10)
    //   return "Прекрасно!"
  }
  
  get FooterText(): string {
    console.log("Games Played: "+ this._gamesPlayed);
    // if(this._firstGameEver){
    //   return "Станьте ближе к 25 000 ₽\nПолучите дополнительную игру сейчас!"
    // }else 
    if(this._gamesPlayed == 1){
      return "Keep playing for today’s 10,000$"
    }else if(this._rightAnswerCount <= this._bestWeekScore) {
      return "Keep playing for today’s 10,000$"
    }else if(this._isInTop){
        if(this._gamesPlayed <=2)
          return "Keep playing for today’s 10,000$"
        else
          return "Keep playing for today’s 10,000$"
    }else if(this._rightAnswerCount > this._bestWeekScore){
        if(this._gamesPlayed <=2)
          return "Keep playing for today’s 10,000$"
        else
          return "Keep playing for today’s 10,000$"
    }else{
      if(this._gamesPlayed <=2)
          return "Keep playing for today’s 10,000$"
        else
          return "Keep playing for today’s 10,000$"
    }
  }

}
