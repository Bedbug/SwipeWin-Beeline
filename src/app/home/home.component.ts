import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { SessionService } from "../session.service";
import { LocalizationService } from "../localization.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { TranslateService } from "@ngx-translate/core";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import UIkit from "uikit";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  loginOn: number;
  lblShow: boolean = true;
  passType: string = "password";
  alertNumber: boolean = false;
  verErrorMes: boolean = false;

  // get this form the User object
  get isHasCashback(): boolean {
    return this._isHasCashback;
  }

  // get this form the User objectusername
  get isSubscribed(): boolean {
    return this._isSubscribed;
  }

  private _isSubscribed = true;
  private _isHasCashback = false;
  public demoGamesPlayed = 0;
  public errorMsg = "";
  public noMoreRealGames = this.translate.instant("MESSAGES.MESSAGE_08");
  public noMoreDemoGames = this.translate.instant("MESSAGES.MESSAGE_09");
  public authError = this.translate.instant("MESSAGES.MESSAGE_10");
  public logOut = this.translate.instant("MESSAGES.MESSAGE_11");
  public blackListed = this.translate.instant("MESSAGES.MESSAGE_12");
  public noCredits = this.translate.instant("MESSAGES.MESSAGE_13");

  public logOutBtn = true;
  public gotofaqBtn = false;

  public lastDemoPlayed: Date;
  public now: Date = new Date();

  public showLogin = true;
  public openVerify = false;
  // Lottie
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  public siteDown = false;
  public showMessage = true;

  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    private localizationService: LocalizationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private translate: TranslateService
  ) {}

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  pause() {
    this.anim.pause();
  }

  setSpeed(speed: number) {
    this.animationSpeed = speed;
    this.anim.setSpeed(speed);
  }

  ngOnInit() {
    this.lottieConfig = {
      path: "assets/logoanim.json",
      renderer: "svg",
      autoplay: true,
      loop: false,
      rendererSettings: {
        progressiveLoad: true,
        preserveAspectRatio: "xMidYMid meet",
        imagePreserveAspectRatio: "xMidYMid meet",
        title: "TEST TITLE",
        description: "TEST DESCRIPTION",
      },
    };

    console.log("Locale: " + this.translate.currentLang);

    // Get Login On From LocalStorage
    this.loginOn = 0;
    this.loginOn = +localStorage.getItem("loginOn");

    if (this.loginOn != 1) console.log("Login is Off");
    if (this.loginOn == 1) {
      this.showLogin = true;
      console.log("Login is On");
    }
    // This Resets Every time the demo games played
    // localStorage.setItem('demoGamesPlayed', "0");
    this.lastDemoPlayed = new Date(localStorage.getItem("lastDemoPlayed"));
    console.log("Last Time Played: " + this.lastDemoPlayed);
    console.log("Now: " + this.now);

    let hours = Math.abs(
      (this.now.getTime() - this.lastDemoPlayed.getTime()) / 3600000
    );
    if (hours > 1) localStorage.setItem("demoGamesPlayed", "0");

    console.log("Substract Dates: " + hours);
    // Check if we have any errorCode in the url, coming from another angular state
    this.activatedRoute.queryParams.subscribe((params) => {
      const errorCode = params["errorCode"];
      let modal = UIkit.modal("#error");

      if (errorCode) {
        switch (errorCode) {
          case "401":
            this.errorMsg = this.authError;
            this.logOutBtn = true;
            this.gotofaqBtn = false;
            console.log("401");
            break;
          case "1010":
            this.errorMsg = this.authError;
            this.logOutBtn = true;
            this.gotofaqBtn = true;
            console.log("1010");
            break;
          case "1026":
            this.errorMsg = this.blackListed;
            this.logOutBtn = true;
            this.gotofaqBtn = true;
            console.log("1026");
            break;
          case "1023":
            this.errorMsg = this.noMoreRealGames;
            this.gotofaqBtn = false;
            this.logOutBtn = false;
            break;
          case "1021":
            this.errorMsg = this.noCredits;
            this.gotofaqBtn = false;
            this.logOutBtn = false;
            break;
          case "1025":
            this.errorMsg = this.noCredits;
            this.gotofaqBtn = false;
            this.logOutBtn = false;
            break;
        }

        if (this.sessionService.user) this.sessionService.reset();

        if (this.errorMsg !== "" && modal != null) {
          modal.show();
        }
      }
    });

    if (this.sessionService.gameSettings.maintenance != null) {
      this.siteDown = this.sessionService.gameSettings.maintenance.siteDown;
      console.log(this.siteDown);
      this.localizationService.init(
        this.sessionService.gameSettings.localization
      );
      if (this.siteDown) {
        console.log("Site is Down!");
        let modalSiteDown = UIkit.modal("#siteDown");
        modalSiteDown.show();
      }
    } else {
      // Load the game settings
      this.dataService.fetchGameSettings().then(
        (data) => {
          this.sessionService.gameSettings = data;
          this.localizationService.init(
            this.sessionService.gameSettings.localization
          );
          this.siteDown = this.sessionService.gameSettings.maintenance.siteDown;
          if (this.siteDown) {
            console.log("Site is Down!");
            let modalSiteDown = UIkit.modal("#siteDown", {
              escClose: false,
              bgClose: false,
            });
            modalSiteDown.show();
          }
          // if (this.showMessage) {
          //   console.log("Show message!");
          //   let modalIntroMessage = UIkit.modal("#introMes", {
          //     escClose: true,
          //     bgClose: true,
          //   });
          //   modalIntroMessage.show();
          // }
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  public playGame($event) {
    // console.log('button is clicked');
    // $event.stopPropagation();
    // this.dataService.authenticateRedirect();
    this.showLogin = true;
  }

  // public playGame($event) {
  //   console.log('button is clicked');
  //   $event.stopPropagation();
  //   this.dataService.authenticateRedirect();
  // }

  logOutUser() {
    console.log("LoggingOut!");
    const allCookies: {} = this.cookieService.getAll();
    console.log(allCookies);
    this.cookieService.deleteAll("/");
    // Trying the updated MTS logout redirect with the logout parameter
    this.sessionService.reset();
    this.router.navigate(["/home"]);
    // this.dataService.logoutRedirect();
  }

  gotoFaqPage() {
    this.logOutUser();
    this.router.navigate(["/faq"]);
  }

  onKey(event: any) {
    // console.log(event.target.value);
    const phoneNumber = parsePhoneNumberFromString(event.target.value, "KZ");

    // const phoneNumber = parsePhoneNumberFromString(event.target.value, 'GR');
    // console.log(phoneNumber.);
    // console.log(phoneNumber.formatNational());
    if (phoneNumber != null)
      event.target.value = phoneNumber.formatInternational();
  }

  submit(number: string) {
    // console.log("MSISDN: " + number);
    const phoneNumber = parsePhoneNumberFromString(number, "KZ");
    number = phoneNumber.countryCallingCode + "" + phoneNumber.nationalNumber;
    console.log(
      "MSISDN: " + phoneNumber.countryCallingCode + phoneNumber.nationalNumber
    );
    console.log(
      "PhoneNumber: " + number + " is valid: " + phoneNumber.isValid()
    );
    console.log(number + " " + number.length);
    if (number.length != 11) {
      this.alertNumber = true;
      return;
    }

    if (!this.sessionService.msisdn) this.sessionService.msisdn = number;

    // Run or Go to returnHome
    // this.router.navigate(['/auth-callback'], { queryParams: { code: number } });

    this.dataService.authenticate(number).subscribe(
      (resp: any) => {
        // Deserialize payload
        const body: any = resp.body; // JSON.parse(response);
        if (body.isEligible !== undefined)
          this.sessionService.isEligible = body.isEligible;
        if (body.isSubscribed != undefined)
          this.sessionService.isSubscribed = body.isSubscribed;
        if (body.gamesPlayedToday !== undefined)
          this.sessionService.gamesPlayed = body.gamesPlayedToday;

        this.showLogin = false;
        this.openVerify = true;

        // If present, Get JWT token from response header and keep it for the session
        const userToken = resp.headers.get("X-Access-Token");
        if (userToken) {
          // if exists, keep it
          this.sessionService.token = userToken;
          this.sessionService.Serialize();

          // Goto the returnHome page
          // this.router.navigate(['/returnhome']);
          // Open Login/Sub Buttons
        }
      },
      (err: any) => {
        //this.sessionService.msisdn = null;
        console.log("This is not a valid number!");
        // this.showLogin = false;
        // this.openVerify = true;
        // this.router.navigate(['/home']);
      }
    );
  }

  verify(pass: string) {
    console.log("username: " + this.sessionService.msisdn);
    console.log("password: " + pass);

    this.dataService
      .authenticateVerify(this.sessionService.msisdn, pass)
      .subscribe(
        (resp: any) => {
          // Get JWT token from response header and keep it for the session
          const userToken = resp.headers.get("X-Access-Token");
          if (userToken)
            // if exists, keep it
            this.sessionService.token = userToken;

          // Deserialize payload
          const body: any = resp.body; // JSON.parse(response);
          console.table(body);
          if (body.isEligible !== undefined)
            this.sessionService.isEligible = body.isEligible;
          if (body.isSubscribed != undefined)
            this.sessionService.isSubscribed = body.isSubscribed;
          if (body.gamesPlayedToday !== undefined)
            this.sessionService.gamesPlayed = body.gamesPlayedToday;
          if (body.optIn !== undefined) this.sessionService.optIn = body.optIn;
          if (body.gamesPlayedFromLastOptin !== undefined)
            this.sessionService.gamesPlayedFromLastOptin =
              body.gamesPlayedFromLastOptin;

          this.sessionService.Serialize();

          // Goto the returnHome page
          this.router.navigate(["/returnhome"]);
        },
        (err: any) => {
          console.log("Error With Pin!!!");
          this.verErrorMes = true;
        }
      );

    // Run or Go to returnHome
    //this.router.navigate(['/auth-callback'], { queryParams: { code: user } });
    localStorage.setItem("loginOn", "0");
  }

  resetPass() {
    this.dataService
      .requestPin(this.sessionService.msisdn)
      .then((resp: any) => {
        console.log("Reset password is successful");
      });
  }

  OpenPass() {
    this.lblShow = !this.lblShow;
    console.log("Hide/Show Password: " + this.lblShow);
    if (this.lblShow) this.passType = "password";
    else this.passType = "test";
  }

  // Check the number of games played in demo mode
  public playDemoGame($event) {
    console.log("Demo button is clicked");

    if (
      !this.sessionService.gameSettings ||
      !this.sessionService.gameSettings.maintenance ||
      this.sessionService.gameSettings.maintenance.siteDown ||
      this.sessionService.gameSettings.maintenance.noGames
    )
      return;

    // this.router.navigate(['demogame']);
    this.demoGamesPlayed = +localStorage.getItem("demoGamesPlayed");
    // Check games count
    console.log("demoGamesPlayed " + this.demoGamesPlayed);
    if (this.demoGamesPlayed >= 2) {
      // popup modal with error
      var modal = UIkit.modal("#error");
      this.errorMsg = this.noMoreDemoGames;
      modal.show();
    } else {
      // Add one and play the demo game
      this.demoGamesPlayed++;
      localStorage.setItem("demoGamesPlayed", this.demoGamesPlayed.toString());
      localStorage.setItem("lastDemoPlayed", new Date().toString());
      // this.router.navigate(['demogame']);
      this.router.navigate(["demogame"]);
    }
  }
}
