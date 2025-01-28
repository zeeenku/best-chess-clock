import { ClockProps } from "@/types";
import { FC, useState, useEffect, useRef } from "react";
import {RotateCcw,Pause,Play, X} from "lucide-react";

enum PlayerColor {
  "black",
  "white"
}
class ClockPlayer {
  timeInMilliSeconds: number;
  incTimeInSeconds: number;
  startTimeInMinutes: number;
  color: PlayerColor | null;
  id: number;

  constructor(id : number, startTimeInMinutes : number, incTimeInSeconds : number, color : PlayerColor? = null){
    this.startTimeInMinutes= startTimeInMinutes;
    this.timeInMilliSeconds= startTimeInMinutes * 60 * 1000; 
    this.incTimeInSeconds= incTimeInSeconds;
    this.id= id;
    this.color = color;
  }

  getClockTime = () => {
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

  setColors = (color: PlayerColor)=>{
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

const Clock: FC<ClockProps> = ({ config }) => {
  const [isGameStarted, setGameStarted] = useState(false);
  const [turnId, setTurnId] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const stepInMilliSeconds = 100;
  const startGame = (turnId : number) => {
    //todo: choose the current turn and make it white where other is black
  }


  const [players, setPlayers] = useState(
    config.map(
      (el) => new ClockPlayer(el.id, el.startTime, el.addiTime )
    )
  );

  const clockRef = useRef<ClockInterval | null>(null);

  const activateClock = (turn : number) => {
    let lostId : number = 0;
    let lostColor : string = "";
    const updatedPlayers = players.map((el) => {
      if (el.id === turn) {
        el.timeInMilliSeconds -= stepInMilliSeconds;
      }
      if(el.timeInMilliSeconds <= 0){
        lostId = el.id;
        lostColor = el.color;
      }
      return el;
    });
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
    const updatedPlayers = players.map((el) => {
      if (el.id === id) {
        el.timeInMilliSeconds += el.incTimeInSeconds * 1000;
      }
      return el;
    });
    setPlayers(updatedPlayers);
  };

  const setColors = (whiteId: number)=>{
    const updatedPlayers = players.map((el) => {
      if (el.id === whiteId) {
        el.color ="white";
      }
      else
      {
        el.color = "black";
      }
      return el;
    });
    setPlayers(updatedPlayers);
  }
  const finishTurn = async (t: number) => {


    if (!isGameStarted) {
      setGameStarted(true);
      await setTurnId(t);
      setColors(t);
      await clockRef.current?.stopInterval();
      await clockRef.current?.startInterval(()=>activateClock(t));
      return;
    }

    if (t !== turnId) return;

    const audio = new Audio('/media/click.mp3');
    audio.play();

    clockRef.current?.stopInterval();
    incTime(t);
    if(players[t-1].color == "black"){
      setTurnCount(turnCount + 1);
    }
    const nextTurn = t === 1 ? 2 : 1;
    // increment turn here....
    await setTurnId(nextTurn);
    await clockRef.current?.startInterval(()=>activateClock(nextTurn));
  };

  const getClockTime = (t: number) => {
    const time = Math.ceil(t / 1000);
    const hI = Math.floor(time / 3600); // Hours if applicable
    const hS = hI < 10 ? hI.toString().padStart(2, '0') : hI.toString();
    const mI = Math.floor((time - hI * 3600) / 60);
    const mS = mI < 10 ? mI.toString().padStart(2, '0') : mI.toString();
    const sI = time % 60;
    const sS = sI < 10 ? sI.toString().padStart(2, '0') : sI.toString();

    return `${hI ? hS + " : " : ""}${mS + " : "}${sS}`;
  };

  const isHorizontal = window.innerWidth > window.innerHeight;

  return (
    <main className={`${isHorizontal ? 'w-[100dvw] h-[100dvh] p-5' : 'p-3 w-[100dvh] h-[100dvw] rotate-90'} 
    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `}>
            <div className="flex h-[10%] bg-red-500 justify-center items-center">
      </div>
      <div className="h-[15%] pt-5 w-full flex space-x-16 justify-around items-end">
      {players.map((player) => (
                 <h2 className="w-1/2 text-4xl text-center lg:text-4xl mb-3">Player {player.id}</h2>
      ))}
      </div>
      <div className={`${isHorizontal ? "h-[45dvh]" :  "h-[45dvw] " } pt-1 w-full flex items-center`}>
        {players.map((player, index) => (
          <>
          <div key={index} className="h-full w-6/12 flex flex-col items-center p-1 lg:px-5">
            <div className="flex lg:flex-col justify-center items-center ">
            {/* <h2 className="text-4xl lg:text-4xl mb-3">Player {player.id} {`${player.color ?? ""}`}</h2> */}
            {/* <h3 className="text-2xl mb-3">
              ({players[index].startTimeInMinutes} + {players[index].incTimeInSeconds})
            </h3> */}
            </div>
            <button
              onClick={() => finishTurn(player.id)}
              className={`${player.id !== turnId ? "active" : "finish-turn"} 
              clock-button w-full text-slate-900 text-4xl time
              `}
            >
              <span className="text-5xl">{getClockTime(player.timeInMilliSeconds)}</span>
            </button>
          </div>
          { index == 0 ? 
          (<h2 className="text-3xl w-16 translate-y-1/4 text-center">
            #{turnCount}
            </h2> )
          : <></>}
          </>
        ))}
      </div>

      <div className="mt-5 text-center text-2xl">
        {isGameStarted ? (
          <>
            <div className="h-[10%] w-full flex justify-center items-center">
                  {players.map((player) => (
                    <>
                            <h2 className="w-2/12 h-full flex items-center space-x-2 justify-center text-center  mb-3">
                            <span className="text-xl lg:text-2xl">{player.color}</span>
                            <span className="text-lg lg:text-xl">{player.startTimeInMinutes}+{player.incTimeInSeconds}</span>
                            </h2>
                            {
                              (player.id == 1 ? 
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
