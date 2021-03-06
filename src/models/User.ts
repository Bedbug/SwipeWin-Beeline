class User {
    id: string = null;
    msisdn: string = null;
    username: string = null;
    picture: string = null;
    age: number = 0;
    gender: string = 'male';
    createdAt: Date = null;
    languagePreference: string = null;
    gamesPlayed: number = 0;
    totalPoints:number = 0;
    bestScore: number = 0;
    lastBestScore: number = 0;
    bestScoreToday: number = 0;
    totalDaysPlaying: number = 0;
    wallet: any = null;
    optIn: boolean = false;


    public toProfileDTO() {
        return {
            id: this.id,
            username: this.username,
            age: this.age,
            gender: this.gender,
            msisdn: this.msisdn,
            languagePreference: this.languagePreference,
            optIn: this.optIn
        };
    }
};
