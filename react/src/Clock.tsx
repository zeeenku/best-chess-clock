import { ClockProps } from "@/types";
import { FC, useState, useEffect, useRef } from "react";
import {RotateCcw,Pause,Play, X} from "lucide-react";

enum PlayerColor {
  black = "black",
  white = "white"
}

class ClockPlayer {
  timeInMilliSeconds: number;
  incTimeInSeconds: number;
  startTimeInMinutes: number;
  color: PlayerColor | null;

  constructor(startTimeInMinutes : number, incTimeInSeconds : number, color : PlayerColor | null = null){
    this.startTimeInMinutes= startTimeInMinutes;
    this.timeInMilliSeconds= startTimeInMinutes * 60 * 1000; 
    this.incTimeInSeconds= incTimeInSeconds;
    this.color = color;
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

  setColor = (color: PlayerColor)=>{
    this.color = color;
    };
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


class ClockConfig{
  isGameStarted : boolean = false;
  turnId : number = -1;
  turnsCount : number = 0;

  incTurnsCount(){
    this.turnsCount++;
  }

  switchTurnId(){
    this.turnId = this.turnId == 1 ? 0 : 1 ;
  }

  start(){
    this.isGameStarted = true;
  }
}

const Clock: FC<ClockProps> = ({ config }) => {
  const [clockConfig, setClockConfig] = useState(new ClockConfig());
  const stepInMilliSeconds = 100;
  
  const ps = config.map(
    (el) => new ClockPlayer(el.startTime, el.addiTime )
  ) as [ClockPlayer, ClockPlayer];

  const [players, setPlayers] = useState(ps);

  const clockRef = useRef<ClockInterval | null>(null);


  const initGame = (whiteId : number) => {
    /**
     * make turn 0
     * referee choose white and black
     * and start
     */
    const updatedPlayers = players.map((el, id) => {
      if (id === whiteId) {
        el.setColor("white" as PlayerColor);
      }
      else
      {
        el.setColor("black" as PlayerColor);
      }
      return el;
    }) as [ClockPlayer, ClockPlayer];

    setPlayers(updatedPlayers);
    clockConfig.start();
    setClockConfig(clockConfig);
    return;
  }




  const activateClock = (turn : number) => {
    let lostId : number = 0;
    let lostColor : PlayerColor | null = null;
    const updatedPlayers = players.map((el, id) => {
      if (id === turn) {
        el.timeInMilliSeconds -= stepInMilliSeconds;
      }
      if(el.timeInMilliSeconds <= 0){
        lostId = id;
        lostColor = el.color;
      }
      return el;
    }) as [ClockPlayer, ClockPlayer];
    setPlayers(updatedPlayers);
    if(lostId){
      //todo: send event to parent or show dialog already her
      //todo: the loser & winner dialog should reflect and also show a replat btn
      //todo: and a btn of go back to config
      //todo: in case of return we would have to send an event again....
      //todo: maybe add a counter for each player as 0-0.....

      console.log(`player ${lostId} with color ${lostColor} lost`);
      clockRef.current?.stopInterval();
    }
  };

  useEffect(() => {
    clockRef.current = new ClockInterval(stepInMilliSeconds);
    return () => {
      if (clockRef.current) {
        clockRef.current.stopInterval();
      }
    };
  }, []);

  const incTime = (id: number) => {
    const updatedPlayers = players.map((el, idd) => {
      if (idd === id) {
        el.timeInMilliSeconds += el.incTimeInSeconds * 1000;
      }
      return el;
    }) as [ClockPlayer, ClockPlayer];
    setPlayers(updatedPlayers);
  };


  const finishTurn = async () => {
    const turnId = clockConfig.turnId;
    await clockRef.current?.stopInterval();
    await incTime(turnId);
  }

  const startTurn = async () => {
    const turnId = clockConfig.turnId;
    await clockRef.current?.startInterval(()=>activateClock(turnId));
  }



  const clockBtnClick = async (t: number) => {

    if (!clockConfig.isGameStarted) {
      await initGame(t);
      const audio = new Audio('/media/click.mp3');
      audio.play();

      clockConfig.turnId = t;
      await setClockConfig(clockConfig);

      await startTurn();
      return;
    }


    console.log("ttt")
    if (t !== clockConfig.turnId && clockConfig.isGameStarted) return;

    console.log("ttt")
    const audio = new Audio('/media/click.mp3');
    audio.play();

    
    finishTurn();
  


    if(players[t].color == "black"){
      clockConfig.incTurnsCount();
    }

  
    clockConfig.switchTurnId();
    await setClockConfig(clockConfig);

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
        {clockConfig.isGameStarted ? (
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
                                  <button><RotateCcw/></button>
                                  <button><Pause/></button>
                                  <button><Play/></button>
                                  <button><X/></button>

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
