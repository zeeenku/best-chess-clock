import { ClockProps } from "@/types"; 
import { FC, useState } from "react";

// Define the ClockPlayer type
interface ClockPlayer {
  timeInMilliSeconds: number;
  incTimeInSeconds: number;
  startTimeInMinutes: number;
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
    this.interval = setInterval(callback, this.updateInterval);
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
  const stepInMilliSeconds = 50;

  const [players, setPlayers] = useState(
    config.map((el) => {
      const p: ClockPlayer = {
        startTimeInMinutes : el.startTime,
        timeInMilliSeconds: el.startTime * 60 * 1000, // Convert to milliseconds
        incTimeInSeconds: el.addiTime,   // Additional time
        id: el.id,
      };
      return p;
    })
  );

  const clock = new ClockInterval(stepInMilliSeconds);
  const activateClock = ()=>{
    const ps = players.map(el=>{
      if(el.id == turnId){
        el.timeInMilliSeconds -= stepInMilliSeconds;
      }
      return el;
    })
    //todo: add loose here
    setPlayers(ps);
  }

  const incTime = (id : number) => {
    const ps = players.map(el=>{
      if(el.id == id){
        el.timeInMilliSeconds += el.incTimeInSeconds*1000;
      }
      return el;
    })
    setPlayers(ps);
  }


  const finishTurn = (t  : number) => {

    if(!isGameStarted){
      setGameStarted(true);
      setTurnId(t);
      clock.startInterval(activateClock);
      return;
    }


    clock.stopInterval();
    incTime(t);


    const nTurn : number = t == 1 ? 2 : 1;
    setTurnId(nTurn);
    clock.startInterval(activateClock);
    return;
  }


  // Function to convert seconds into a formatted time
  const getClockTime = (t: number) => {
    const time = Math.ceil(t/1000);
    const hI = Math.floor(time / 3600); // Hours if applicable
    const hS = hI < 10 ? hI.toString().padStart(2, '0') : hI.toString();
    const mI = Math.floor((time - hI*3600)/60);
    const mS = mI < 10 ? mI.toString().padStart(2, '0') : mI.toString();
    const sI = time % 60;
    const sS = sI < 10 ? sI.toString().padStart(2, '0') : sI.toString();

    return `${hI ? hS + " : " : ""}${ mI  || hI ? mS + " : " : ""}${sS}`;
  };

  return (
    <main className="w-screen h-screen px-20">
      <div className="h-[80vh] mt-5 flex">
        {players.map((player, index) => (
          <div key={index} className="h-full w-6/12 flex flex-col items-center p-5">
            <h2 className="text-4xl mb-3">Player {player.id}</h2>
            <h3 className="text-2xl mb-3">
              {players[index].startTimeInMinutes} + {players[index].incTimeInSeconds}
            </h3>
            <button onClick={()=>finishTurn(player.id)} className="clock-button w-full h-full text-slate-900 text-4xl time">
              <span className="text-5xl">
                {getClockTime(player.timeInMilliSeconds)}
              </span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 text-center text-2xl">
        {
          isGameStarted ? (
            // show bts
            <div>hhhh</div>
          ) : 
            <h3>The white to click on a button and Start The game</h3>

        }
      </div>
    </main>
  );
};

export default Clock;
