import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { DataService } from '../data.service';

declare const UIkit: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  url: string;
  pushed = false;
  alignAllLeft = true;
  that = this;
  public mobileMenuState = false;
  public menuIconPath = 'menu';
  public siteDown = true;
  constructor(private dataService : DataService, private session: SessionService, private router: Router,public translate: TranslateService) 
  {
    // this.url = router.url;
  }

  

  ngOnInit() {
    if(this.translate.currentLang == "ru") {
      this.alignAllLeft = false;
    } else {
      this.alignAllLeft = true;
    }
    const that = this;

    document.getElementById('offcanvas-nav').addEventListener('click', function () {
     
      that.pushed = !that.pushed;

    });
    // UIkit.util.on('#offcanvas-nav', 'hide', function (e) {
    //   // do something
    //   console.log(this);
    //   console.log(this.parentElement);
    //   console.log(this.parentElement.getElementsByClassName('hamburger-menu'));
      
    //   const currentClass = this.parentElement.getElementsByClassName('hamburger-menu')[0].children[0].className;

    //   if (currentClass.includes('pushed')) {
    //     that.toggleClass();
    //   }
    // });
    // if(this.session.gameSettings.maintenance != null){
    //   this.siteDown = this.session.gameSettings.maintenance.siteDown
    // } else {
    //   // Load the game settings
    //   this.dataService.fetchGameSettings().then(
    //     data => {
    //       this.session.gameSettings = data;
    //       if(this.session.gameSettings.maintenance.siteDown){
    //         console.log("Site is Down!");
    //         this.siteDown = this.session.gameSettings.maintenance.siteDown
    //       }
    //     },
    //     err => {
    //       console.error(err);
    //     });
    // }

    
  }

 
  public test(){
    console.log("Click!!!");
  }

  public toggleClass() {
    console.log("Toggleing!!!");
    console.log(this.pushed);
    this.pushed = !this.pushed;
  }

  public changeMenuState(event) {
    this.mobileMenuState = !this.mobileMenuState;
    console.log(this.mobileMenuState);
    if (this.menuIconPath === 'menu') {
      this.menuIconPath = 'close';
    } else {
      this.menuIconPath = 'menu';
    }
  }
  closeOffcanvas() {
    UIkit.offcanvas('#offcanvas-nav').hide();
  }
  
  gotoProfile(){
    this.router.navigate(['/profile']);
  }
  
   gotoHome() {
     if (!this.session.token) {
      // Redirect him to Home
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/returnhome']);
    }
    
   }

   changeLanguage() {
    this.alignAllLeft = !this.alignAllLeft;
   //  const browserLang = this.translate.getBrowserLang();
   //  console.log(browserLang);
   //  this.translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
   if(!this.alignAllLeft)
     this.translate.use("ru");
     else
     this.translate.use("kaz");
  }

}
