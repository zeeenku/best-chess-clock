import { ClockProps, } from "@/types";  // Ensure this import is correct
import { FC } from "react";

const Clock: FC<ClockProps> = ({ players }) => {
  return (
    <main className="w-screen h-screen">
    <div className="h-[80vh] mt-5 flex">
      {players.map((player, index) => (
        <div key={index} className={`h-full w-6/12 flex flex-col items-center p-5`}>

        <h2 className="text-4xl mb-3">Player {player.id} </h2>
        <button className="clock-button w-full h-full text-slate-900 text-4xl time">
          <span className="text-5xl">
            {player.startTime}
          </span> 
        </button>
        </div>  // Renders each player's name
      ))}
    </div>
    </main>
  );
};

export default Clock;
