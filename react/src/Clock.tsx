import { ClockProps } from "@/types"; 
import { FC, useState } from "react";

// Define the ClockPlayer type
interface ClockPlayer {
  timeInSeconds: number;
  incTimeInSeconds: number;
  id: number;
}

const Clock: FC<ClockProps> = ({ players }) => {
  // Map over players and create new state with the appropriate structure
  const [playersState, setPlayers] = useState(
    players.map((el) => {
      const p: ClockPlayer = {
        timeInSeconds: el.startTime * 60, // Convert to seconds
        incTimeInSeconds: el.addiTime,   // Additional time
        id: el.id,
      };
      return p;
    })
  );

  // Function to convert seconds into a formatted time
  const getClockTime = (time: number) => {
    const sI = time % 60;
    const sS = sI < 10 ? sI.toString().padStart(2, '0') : sI.toString();

    const m = Math.floor(time / 60);
    const h = Math.floor(time / 3600); // Hours if applicable

    return `${h ? h + " : " : ""}${m ? m + " : " : ""}${sS}`;
  };

  return (
    <main className="w-screen h-screen px-20">
      <div className="h-[80vh] mt-5 flex">
        {playersState.map((player, index) => (
          <div key={index} className="h-full w-6/12 flex flex-col items-center p-5">
            <h2 className="text-4xl mb-3">Player {player.id}</h2>
            <h3 className="text-2xl mb-3">
              {players[index].startTime} + {players[index].addiTime}
            </h3>
            <button className="clock-button w-full h-full text-slate-900 text-4xl time">
              <span className="text-5xl">
                {getClockTime(player.timeInSeconds)}
              </span>
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Clock;
