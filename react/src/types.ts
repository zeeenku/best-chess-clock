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
    data : ClockGameResult,
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


interface ClockGameResultPlayer {
    color: ClockPlayerColor;
    format: string;
    totalTimeInSeconds: number;
    totalTurns: number;
}

interface ClockHistoryData {
    results : [number,number];
    history : ClockGameResult[];
}

export class ClockHistory {
    data: ClockHistoryData; 

    constructor() {
    const historyData = localStorage.getItem("chess-clock-history");
    this.data = (historyData ? JSON.parse(historyData) : { results: [0, 0], history: [] } ) as ClockHistoryData;
    }

    add(el: ClockGameResult) {
    if (el.looserId === -1) {
        this.data.results[0] += 0.5;
        this.data.results[1] += 0.5;
    } else {
        this.data.results[el.looserId === 0 ? 1 : 0] += 1;
    }
    this.data.history.unshift(el);
    }

    save() {
    localStorage.setItem("chess-clock-history", JSON.stringify(this.data));
    }

    clear() {
    localStorage.removeItem("chess-clock-history");
    this.data = { results: [0, 0], history: [] }; // Reset data after clearing localStorage
    }
}

export enum ClockGameResults{
    player_1_lost = 0,
    player_2_lost = 1, 
    draw = -1
}

export enum ClockGameResultReasons{
    timeOut = "Time Out",
    draw = "Decision or Stalemate",
    checkmate = "Checkmate"
}

export class ClockGameResult {
    players: [ClockGameResultPlayer, ClockGameResultPlayer];
    looserId: ClockGameResults;
    turnsCount: number;
    gameTotalTime: number;
    gameEndTime: Date;
    resultMadeBy: ClockGameResultReasons;

    constructor(ps: [ClockPlayer, ClockPlayer], clockConf: ClockConfig, looserId: ClockGameResults, resultMadeBy: ClockGameResultReasons) {
    let totalPlayTimeInMilliSeconds = 0;

    this.players = ps.map((e, id) => {
        let playerTurns = clockConf.turnsCount;
        playerTurns += e.color === "white" && clockConf.turnId === id ? 1 : 0;

        const totalPlayerTimeInMilliSeconds = e.startTimeInMinutes * 60 * 1000 - e.timeInMilliSeconds + (playerTurns * e.incTimeInSeconds * 1000);
        totalPlayTimeInMilliSeconds += totalPlayerTimeInMilliSeconds;

        const el: ClockGameResultPlayer = {
        color: e.color!,
        format: `${e.startTimeInMinutes}+${e.incTimeInSeconds}`,
        totalTimeInSeconds: parseFloat((totalPlayerTimeInMilliSeconds / 1000).toFixed(2)),
        totalTurns: playerTurns,
        };

        return el;
    }) as [ClockGameResultPlayer, ClockGameResultPlayer];

    this.looserId = looserId;
    this.resultMadeBy = resultMadeBy;
    if (looserId === ClockGameResults.draw) {
        this.resultMadeBy = ClockGameResultReasons.draw;
    }
    this.turnsCount = clockConf.turnsCount;
    this.gameTotalTime = parseFloat((totalPlayTimeInMilliSeconds / 1000).toFixed(2));
    this.gameEndTime = new Date();
    }
}
