export type TimeRecom = {
    name: string,
    time : number,
};

export type Player = {
    startTime: number,
    addiTime: number,
};

export interface ClockProps {
    config : [Player, Player],
    onReturnToHome : CallableFunction,
};


export interface ClockResultGridProps {
    data : GameResult,
};












export enum ClockPlayerColor {
    black = "black",
    white = "white"
}

export class ClockPlayer {
    timeInMilliSeconds: number;
    incTimeInSeconds: number;
    startTimeInMinutes: number;
    color: ClockPlayerColor | null;

    constructor(startTimeInMinutes : number, incTimeInSeconds : number, color : ClockPlayerColor | null = null){
    this.startTimeInMinutes= startTimeInMinutes;
    this.timeInMilliSeconds= startTimeInMinutes * 60 * 1000; 
    this.incTimeInSeconds= incTimeInSeconds;
    this.color = color;
    }

    restartTime(){
    this.timeInMilliSeconds= this.startTimeInMinutes * 60 * 1000; 
    }
    getTimeFormatted = () => {
    const t = this.timeInMilliSeconds;
    const time = Math.ceil(t / 1000);
    const hI = Math.floor(time / 3600); // Hours if applicable
    const hS = hI < 10 ? hI.toString().padStart(2, '0') : hI.toString();
    const mI = Math.floor((time - hI * 3600) / 60);
    const mS = mI < 10 ? mI.toString().padStart(2, '0') : mI.toString();
    const sI = time % 60;
    const sS = sI < 10 ? sI.toString().padStart(2, '0') : sI.toString();
    return `${hI ? hS + " : " : ""}${mS + " : "}${sS}`;
    };

    setColor = (color: ClockPlayerColor)=>{
    this.color = color;
    };

    incTime = () => {
        this.timeInMilliSeconds += this.incTimeInSeconds * 1000;
    }

    }



export class ClockInterval {
    interval: number | null;
    updateInterval: number;

    constructor(updateInterval: number) {
    this.interval = null;
    this.updateInterval = updateInterval;
    }

    startInterval(callback: CallableFunction) {
    if (this.interval === null) {
        this.interval = setInterval(callback, this.updateInterval);
    }
    }

    stopInterval() {
    if (this.interval !== null) {
        clearInterval(this.interval);
        this.interval = null;
    }
    }
}


export enum ClockStatus {
    notStarted = "notStarted",
    active = "active",
    paused = "paused",
    finished = "finished"
};

export class ClockConfig{
    gameStatus : ClockStatus = ClockStatus.notStarted;
    turnId : number = -1;
    turnsCount : number = 0;

    setClock(gameStatus : ClockStatus, turnId : number, turnsCount : number){
    this.gameStatus = gameStatus;
    this.turnId = turnId;
    this.turnsCount = turnsCount; 
    }
    initClock(){
    this.gameStatus = ClockStatus.notStarted;
    this.turnId = -1;
    this.turnsCount = 0;  
    }

    isGameStatus(status : ClockStatus){
    return this.gameStatus == status; 
    }


    setGameStatus(status : ClockStatus){
    return this.gameStatus = status; 
    }

    incTurnsCount(){
    this.turnsCount++;
    }

    switchTurnId(){
    this.turnId = this.turnId == 1 ? 0 : 1 ;
    }

    start(){
    this.setGameStatus(ClockStatus.active);
    }

    getTurnsCountFormatted(){
    return (this.turnsCount < 10 ? "#0" : "#"  )+ this.turnsCount.toString();
    }
}


interface GameResultPlayerData {
    color: ClockPlayerColor;
    format: string;
    totalTimeInSeconds: number;
    totalTurns: number;
}

interface GamesHistoryData {
    results : [number,number];
    history : GameResult[];
}

// history is a queue
export class GamesHistory {
    data: GamesHistoryData; 

    constructor() {
    const historyData = localStorage.getItem("chess-clock-history");
    this.data = (historyData ? JSON.parse(historyData) : { results: [0, 0], history: [] } ) as GamesHistoryData;
    
}


    getLast(){
        return this.data.history[0];
    }

    hasActiveGame(){
        return this.data.history[0].status === GameStatus.active;
    }

    getActive() : GameResult | null {
        if(this.data.history[0].status === GameStatus.active){
            return this.data.history[0];
        }
        return null;
    }

    setActive(newData : GameResult){
        if(this.data.history[0].status === GameStatus.active){
            this.data.history[0] = newData;
        }
    }

    updateActiveAndSave(ps: [ClockPlayer, ClockPlayer], clockConf: ClockConfig){
        this.data.history[0].update(ps, clockConf);
        this.save();
    }

    getAllGames(){
        return this.data.history;
    }

    getScores(){
        return this.data.results;
    }

    add(el: GameResult) {
    this.data.history.unshift(el);
    }

    updateScoreAndFinishActiveAndSave(gameResult: GameResults, gameResultDecision: GameResultDecisions){
        this.data.history[0].finish(gameResult, gameResultDecision);

        if (gameResult === GameResults.draw ) {
            this.data.results[0] += 0.5;
            this.data.results[1] += 0.5;
        } else {
            this.data.results[gameResult === 0 ? 1 : 0] += 1;
        }
        this.save();
    }
    save() {
    localStorage.setItem("chess-clock-history", JSON.stringify(this.data));
    }

    clear() {
    localStorage.removeItem("chess-clock-history");
    this.data = { results: [0, 0], history: [] }; // Reset data after clearing localStorage
    }
}



export enum GameResults{
    player_1_lost = 0,
    player_2_lost = 1, 
    draw = -1
}

export enum GameResultDecisions{
    timeOut = "Time Out",
    draw = "Decision or Stalemate",
    checkmate = "Checkmate or Resignation"
}




enum GameStatus{
    active = "active",
    finished = "finished"
}

export class GameResult {
    players: [GameResultPlayerData, GameResultPlayerData];
    gameResult: GameResults | null = null;
    turnsCount: number;
    gameTotalTime: number;
    gameStartTime : Date;
    gameEndTime: Date | null = null; // for games history feature....
    gameResultDecision: GameResultDecisions | null = null;

    status : GameStatus;
    constructor(ps: [ClockPlayer, ClockPlayer]){
        this.gameStartTime = new Date();
        this.status = GameStatus.active;
        this.turnsCount = 0;
        this.gameTotalTime = 0;
        this.players = ps.map((e) => {
            const el: GameResultPlayerData = {
            color: e.color!,
            format: `${e.startTimeInMinutes}m + ${e.incTimeInSeconds}s`,
            totalTimeInSeconds: 0,
            totalTurns: 0,
            };
    
            return el;
        }) as [GameResultPlayerData, GameResultPlayerData];
    }

    update(ps: [ClockPlayer, ClockPlayer], clockConf: ClockConfig){
        let totalPlayTimeInMilliSeconds = 0;

        this.players = ps.map((e, id) => {
            // compatibility prob with turns and how to end games.....
            let playerTurns = clockConf.turnsCount;
            playerTurns += e.color === "white" && clockConf.turnId === id ? 1 : 0;
    
            // this methof for total time wotks perfectly tbh no need to use another one
            // even if i do use another on, it will most likely give uncompatible results in case of clock page update
            const totalPlayerTimeInMilliSeconds = e.startTimeInMinutes * 60 * 1000 - e.timeInMilliSeconds + (playerTurns * e.incTimeInSeconds * 1000);
            totalPlayTimeInMilliSeconds += totalPlayerTimeInMilliSeconds;
    
            const el: GameResultPlayerData = {
            color: e.color!,
            format: `${e.startTimeInMinutes}m + ${e.incTimeInSeconds}s`,
            totalTimeInSeconds: parseFloat((totalPlayerTimeInMilliSeconds / 1000).toFixed(2)),
            totalTurns: playerTurns,
            };
    
            return el;
        }) as [GameResultPlayerData, GameResultPlayerData];
    

        this.turnsCount = clockConf.turnsCount;
        this.gameTotalTime = parseFloat((totalPlayTimeInMilliSeconds / 1000).toFixed(2));
    }


    finish(gameResult: GameResults, gameResultDecision: GameResultDecisions) {
    this.gameResult = gameResult;
    this.gameResultDecision = gameResultDecision;

    if (gameResult === GameResults.draw) {
        this.gameResultDecision = GameResultDecisions.draw;
    }

    this.gameEndTime = new Date();
    this.status = GameStatus.finished;
    }
}
