import { ClockProps } from "@/types";
import { FC, useState, useEffect, useRef } from "react";
import {RotateCcw,Pause,Play, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "./components/ui/toaster2";

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


const Clock: FC<ClockProps> = ({ config }) => {

  /**
   * cock logic objects declarations section
   */

  const { toast } = useToast()


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


  const pauseClock = async () => {
    stopTurn();

    await setClockConfig(prevConfig => {
      const newConfig : ClockConfig = new ClockConfig();
      newConfig.setClock(ClockStatus.paused, prevConfig.turnId , prevConfig.turnsCount);
      return newConfig ;
    });

    toast({
      title: "The chess clock is paused now.",
    })
  }

  const playClock = async () => {
    await setClockConfig(prevConfig => {
    const newConfig : ClockConfig = new ClockConfig();
    newConfig.setClock(ClockStatus.active, prevConfig.turnId , prevConfig.turnsCount);
    return newConfig ;
  }); 


  
    await startTurn();
    toast({
      title: "The chess clock is playing now.",
    })
    console.log("hhhhh")
  }

  const looseGame = (looserId : number) => {
    stopTurn();
    setClockConfig(prevConfig => {
      const newConfig : ClockConfig = new ClockConfig();
      newConfig.setClock(ClockStatus.finished, prevConfig.turnId , prevConfig.turnsCount);
      return newConfig ;
    });
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

  const runClock = async (turn : number) => {
  

    await setPlayers( players.map((el, id)=>{
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
      await looseGame(turn);
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
  if(clockConfig.isGameStatus(ClockStatus.paused)){
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
    if (clockConfig.isGameStatus(ClockStatus.notStarted)) {

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
      clockConfig.isGameStatus(ClockStatus.active))
      return;

      console.log("ttttt")
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

  /**isten for space keyboard clicks */
  document.body.onkeydown = async (e) => {

    if(
      clockConfig.isGameStatus(ClockStatus.active) && 
    (e.key == " " || e.code == "Space"   )
    ) {
      e.preventDefault();
      const t = clockConfig.turnId as number;
      await clockBtnClick(t);
    }
  }

  const isHorizontal = window.innerWidth > window.innerHeight;

  return (
    <main className={`${isHorizontal ? 'w-[100dvw] h-[100dvh]' : 'w-[100dvh] h-[100dvw] rotate-90'} 
    py-3 lg:py-5 px-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `}>
            
            <div className="w-1/2">
            < Toaster />
            </div>
      <div className="flex h-[10%] space-x-14 text-xl justify-center items-center">
        <Button>Clear Score</Button>
        <h1>Best Chess Clock</h1>
        <Button>Download App</Button>
      </div>





      <div className={`h-[61%] pt-[4%] w-full  flex items-center`}>
        {players.map((player, id) => (
          <>
          <div key={id} className="h-full w-6/12 flex flex-col items-center p-1 lg:px-5">
            <div className="flex lg:flex-col justify-center items-center ">
            </div>
            <button
              onClick={() => clockBtnClick(id)}
              className={`${id !== clockConfig.turnId ? "active" : "finish-turn"} 
              clock-button w-full text-slate-900 text-2xl lg:text-4xl time relative
              flex justify-between items-center flex-col p-4 md:p-5
              `}
            >

              <span className="block w-fit capitalize font-semibold rounded-md text-center px-1.5 text-slate-900 text-xl md:text-2xl">
                Player {id+1} 
              </span>


            
              <span className="text-2xl md:text-3xl">{player.getTimeFormatted()}</span>

              <div className="w-full flex justify-between ">
              <span className="block w-fit text-xs md:text-sm font-medium lowercase rounded-md px-1.5 bg-brown text-white">
                0 pts 
              </span>

              <span className="block w-fit text-xs md:text-sm font-medium lowercase rounded-md px-1.5 bg-brown text-white">
                {player.color} 
                <span className="text-xs md:text-sm"> {player.startTimeInMinutes}+{player.incTimeInSeconds}</span>
              </span>
              </div>
            </button>
          </div>
          { id == 0 ? 
          (<h2 className="text-2xl w-20 md:w-16 translate-y-1/4 text-center">
            {clockConfig.getTurnsCountFormatted()}
            </h2> )
          : <></>}
          </>
        ))}
      </div>


      <div className="w-full pb-[4%] h-[20%] pt-6 lg:pt-8 flex space-x-2 justify-center items-center px-2">

{
  !clockConfig.isGameStatus(ClockStatus.notStarted) ? 
  <>
  <button onClick={clickRestart} className="bg-[#f5e0d5] font-medium w-24 text-slate-900 text-sm items-center justify-center flex px-2 rounded-full">
    <RotateCcw className="w-4" />
    <span className="text-sm ps-1"
    >restart</span>
    </button>
  <button onClick={pausePlayClock}
    className="bg-[#f5e0d5] font-medium text-slate-900 text-sm items-center justify-center flex p-2 rounded-full"
  >
  {
    clockConfig.isGameStatus(ClockStatus.active) ? 
    <Pause className="fill-slate-900"/> :
    <Play className="fill-slate-900"/>
}
  </button>

  <button onClick={()=>looseGame(0)} className="bg-[#f5e0d5] font-medium w-24 text-slate-900 text-sm items-center justify-center flex px-2 rounded-full">
    <X className="w-4" />
    <span className="text-xs ps-1"
    >end game</span>
    </button>

  </>
  : 
  <h3 className="text-sm lg:text-lg w-fit mx-auto h-fit rounded-md px-2">
    The white to click a button & start the game
  </h3>
}
</div>




      <div className="text-xs h-[10%] items-center flex gap-1 px-3 lg:px-5 justify-between">
        <span>&copy; made by <a href="https://dev.zeenku.com" className="underline text-amber-700">Zenku</a> (Enajjachi Zakariaa).</span>

        <h3 className="text-sm lg:text-base w-fit mx-auto h-fit rounded-md px-2">
          {!clockConfig.isGameStatus(ClockStatus.notStarted) ? (
            <span className="hidden md:inline">          Tip: You can press <span className="bg-brown mt-1 text-base text-white rounded-lg px-1">enter</span> to switch turns
</span>
          ) : (
            <></>
          )}
      
            
            </h3>

          <span className="text-gray-300 text-center">You can read the code (<a href="https://github.com/zeeenku/best-chess-clock" className="underline text-amber-700">repo</a>)</span>
        </div>

    </main>
  );
};

export default Clock;
