import { ClockProps } from "@/types";
import { FC, useState, useEffect, useRef } from "react";
import {RotateCcw,Pause,Play, X} from "lucide-react";

enum ClockPlayerColor {
  black = "black",
  white = "white"
}

class ClockPlayer {
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



class ClockInterval {
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


enum ClockStatus {
  notStarted = "notStarted",
  active = "active",
  paused = "paused",
  finished = "finished"
};

class ClockConfig{
  gameStatus : ClockStatus = "notStarted";
  turnId : number = -1;
  turnsCount : number = 0;

  initClock(){
    this.gameStatus = "notStarted" as ClockStatus;
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
    this.setGameStatus("active" as ClockStatus);
  }
}


const Clock: FC<ClockProps> = ({ config }) => {

  /**
   * cock logic objects declarations section
   */
  const [clockConfig, setClockConfig] = useState(new ClockConfig());




  const [players, setPlayers] = useState(config.map(
    (el) => new ClockPlayer(el.startTime, el.addiTime )
  ) as [ClockPlayer, ClockPlayer]);





  const clockIntRef = useRef<ClockInterval | null>(null);
  const clockUpdateIntStep = 100;
  // init clock interval
  useEffect(() => {
    clockIntRef.current = new ClockInterval(clockUpdateIntStep);
    return () => {
      if (clockIntRef.current) {
        clockIntRef.current.stopInterval();
      }
    };
  }, []);



  /**
   * clock functionnalities section
   */


  const initGame = (whiteId : number) => {
    /**
     * make turn 0
     * referee choose white and black
     * and start
     */
    const updatedPlayers = players.map((el, id) => {
      if (id === whiteId) {
        el.setColor("white" as ClockPlayerColor);
      }
      else
      {
        el.setColor("black" as ClockPlayerColor);
      }
      return el;
    }) as [ClockPlayer, ClockPlayer];

    setPlayers(updatedPlayers);
    clockConfig.start();
    setClockConfig(clockConfig);
    return;
  }






  const stopTurn = async () => {
    await clockIntRef.current?.stopInterval();
  }


  const pauseClock = () => {
    stopTurn();
    clockConfig.setGameStatus("paused" as ClockStatus);
  }

  const playClock = async () => {
    await clockConfig.setGameStatus("active" as ClockStatus);
    await startTurn();
  }

  const looseGame = (looserId : number) => {
    stopTurn();
    clockConfig.setGameStatus("finished" as ClockStatus);
    //clockConfig.turnId
    setClockConfig(clockConfig);
    //todo : use it for game result component
    alert(`player ${looserId+1} has lost`);
    restartClock();
  }

  const restartClock = () => {

    stopTurn();

    // init players
    const newPlayers = players.map((el)=>{
          el.restartTime();
          return el;
        }) as [ClockPlayer , ClockPlayer];

    setPlayers(newPlayers);


    clockConfig.initClock();
    setClockConfig(clockConfig);
  }

  const runClock = (turn : number) => {
  

    setPlayers( players.map((el, id)=>{
      if(id == turn){
        el.timeInMilliSeconds -= clockUpdateIntStep;
      }
      return el;
    }) as [ClockPlayer, ClockPlayer]);


    const isLost = players[turn].timeInMilliSeconds <= 0;

    if(isLost){
      //todo: send event to parent or show dialog already her
      //todo: the loser & winner dialog should reflect and also show a replat btn
      //todo: and a btn of go back to config
      //todo: in case of return we would have to send an event again....
      //todo: maybe add a counter for each player as 0-0.....
      looseGame(turn);
    }
  };


  const startTurn = async () => {
    const turnId = clockConfig.turnId;
    await clockIntRef.current?.startInterval(()=>runClock(turnId));
  }






  const playSoundEffect = (t : "click" | "timeout") => {
    let stt = "/media/click.mp3";
    if(t == "timeout"){
      stt = "";
    }
    const audio = new Audio(stt);
    audio.play();
  }





/*
  btns click section
*/

const pausePlayClock = () => {
  if(clockConfig.isGameStatus("paused" as ClockStatus)){
    playClock();
  }
  else
  {
    pauseClock();
  }
}


const clickRestart = () => {
    restartClock();
}




  const clockBtnClick = async (t: number) => {

    /**
     * game must be either notstarted or active to work....
     */
    /**
     * if game not started start game
     */
    if (clockConfig.isGameStatus("notStarted" as ClockStatus)) {

      // play sound effect
      playSoundEffect("click");

      // init colors and turns count
      await initGame(t);

      // set turn to the current player
      clockConfig.turnId = t;
      await setClockConfig(clockConfig);

      // start turn
      await startTurn();
      return;
    }


    /**
     * if game already started
     */
    // validate
    if (t !== clockConfig.turnId && 
      clockConfig.isGameStatus("active" as ClockStatus))
      return;

    // sound effect
    playSoundEffect("click");

    // finish old turn
    stopTurn();
  

    // inc player time
    players[t].incTime();
    setPlayers(players);


    // if current player is black that means a new turn should be incremented
    if(players[t].color == "black"){
      clockConfig.incTurnsCount();
    }

    // switch turn to the other player
    clockConfig.switchTurnId();
    await setClockConfig(clockConfig);


    // start turn
    await startTurn();
  };


  const isHorizontal = window.innerWidth > window.innerHeight;

  return (
    <main className={`${isHorizontal ? 'w-[100dvw] h-[100dvh] p-5' : 'p-3 w-[100dvh] h-[100dvw] rotate-90'} 
    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `}>
            <div className="flex h-[10%] bg-red-500 justify-center items-center">
      </div>
      <div className="h-[15%] pt-5 w-full flex space-x-16 justify-around items-end">
      {players.map((player, id) => (
                 <h2 className="w-1/2 text-4xl text-center lg:text-4xl mb-3">Player {id}</h2>
      ))}
      </div>
      <div className={`${isHorizontal ? "h-[45dvh]" :  "h-[45dvw] " } pt-1 w-full flex items-center`}>
        {players.map((player, id) => (
          <>
          <div key={id} className="h-full w-6/12 flex flex-col items-center p-1 lg:px-5">
            <div className="flex lg:flex-col justify-center items-center ">
            {/* <h2 className="text-4xl lg:text-4xl mb-3">Player {player.id} {`${player.color ?? ""}`}</h2> */}
            {/* <h3 className="text-2xl mb-3">
              ({players[index].startTimeInMinutes} + {players[index].incTimeInSeconds})
            </h3> */}
            </div>
            <button
              onClick={() => clockBtnClick(id)}
              className={`${id !== clockConfig.turnId ? "active" : "finish-turn"} 
              clock-button w-full text-slate-900 text-4xl time
              `}
            >
              <span className="text-5xl">{player.getTimeFormatted()}</span>
            </button>
          </div>
          { id == 0 ? 
          (<h2 className="text-3xl w-16 translate-y-1/4 text-center">
            #{clockConfig.turnsCount}
            </h2> )
          : <></>}
          </>
        ))}
      </div>

      <div className="mt-5 text-center text-2xl">
        {!clockConfig.isGameStatus("notStarted" as ClockStatus) ? (
          <>
            <div className="h-[10%] w-full flex justify-center items-center">
                  {players.map((player, id) => (
                    <>
                            <h2 className="w-2/12 h-full flex items-center space-x-2 justify-center text-center  mb-3">
                            <span className="text-xl lg:text-2xl">{player.color}</span>
                            <span className="text-lg lg:text-xl">{player.startTimeInMinutes}+{player.incTimeInSeconds}</span>
                            </h2>
                            {
                              (id == 1 ? 
                                <div className="w-[36%] h-full px-2">
                                  <button onClick={clickRestart}><RotateCcw/></button>
                                  <button onClick={pausePlayClock}><Pause/></button>
                                  <button onClick={pausePlayClock}><Play/></button>
                                  <button onClick={()=>looseGame(0)}><X/></button>

                                </div>
                                : <></>)
                            }
                            </>
                  ))}
            </div>
          </>
        ) : (

          <h3>The white to click a button & start the game</h3>
        )}
      </div>

      <div className="text-base lg:flex hidden h-[7%] items-end gap-1 justify-center">
        Tip: You can press Enter to switch turns
      </div>
      <div className="text-xs h-[7%] items-end flex gap-1 justify-center">
        <span>&copy; made by <a href="https://dev.zeenku.com" className="underline text-amber-700">Zenku</a> (Enajjachi Zakariaa).</span>

          <span className="text-gray-300 text-center">You can read the code (<a href="https://github.com/zeeenku/best-chess-clock" className="underline text-amber-700">repo</a>)</span>
        </div>

    </main>
  );
};

export default Clock;
