import { ClockProps } from "@/types";
import { FC, useState, useEffect, useRef } from "react";

// Define the ClockPlayer type
interface ClockPlayer {
  timeInMilliSeconds: number;
  incTimeInSeconds: number;
  startTimeInMinutes: number;
  color: string;
  id: number;
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
  const stepInMilliSeconds = 100;
  
  // Players state
  const [players, setPlayers] = useState(
    config.map((el) => ({
      startTimeInMinutes: el.startTime,
      timeInMilliSeconds: el.startTime * 60 * 1000, // Convert to milliseconds
      incTimeInSeconds: el.addiTime, // Additional time
      id: el.id,
      color : ""
    }))
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

    const nextTurn = t === 1 ? 2 : 1;
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

  return (
    <main className="w-screen h-screen px-20">
      <div className="h-[80vh] mt-5 flex">
        {players.map((player, index) => (
          <div key={index} className="h-full w-6/12 flex flex-col items-center p-5">
            <h2 className="text-4xl mb-3">Player {player.id} {`${player.color ?? ""}`}</h2>
            <h3 className="text-2xl mb-3">
              {players[index].startTimeInMinutes} + {players[index].incTimeInSeconds}
            </h3>
            <button
              onClick={() => finishTurn(player.id)}
              className={`${player.id !== turnId ? "active" : "finish-turn"} 
              clock-button w-full h-full text-slate-900 text-4xl time
              `}
            >
              <span className="text-5xl">{getClockTime(player.timeInMilliSeconds)}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 text-center text-2xl">
        {isGameStarted ? (
          <div>Game is running...</div>
        ) : (
          <h3>The white needs to click the button to start the game</h3>
        )}
      </div>
    </main>
  );
};

export default Clock;
