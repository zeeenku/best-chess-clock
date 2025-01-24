import { ClockProps, } from "@/types";  // Ensure this import is correct
import { FC } from "react";

const Clock: FC<ClockProps> = ({ players }) => {
  return (
    <div>
      {players.map((player, index) => (
        <div key={index}>{player.id}</div>  // Renders each player's name
      ))}
    </div>
  );
};

export default Clock;
