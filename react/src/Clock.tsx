import { ClockProps, } from "@/types";  // Ensure this import is correct
import { FC } from "react";

const Clock: FC<ClockProps> = ({ players }) => {
  return (
    <div className="w-screen h-[80vh] mt-[10vh] flex">
      {players.map((player, index) => (
        <div key={index} className={`h-full w-6/12 p-5`}>
        <button className="clock-button w-full h-full time"> 
          {player.startTime}
        </button>
        </div>  // Renders each player's name
      ))}
    </div>
  );
};

export default Clock;
