import { FC } from "react";
import { ClockHistory, ClockResultGridProps } from "./types";

const ClockResultGrid: FC<ClockResultGridProps> = ({ data }) => {


  const history = (new ClockHistory()).data;
/**
 * 
 * playerslooserIdturnsCountgameTotalTimegameEndTimeresultMadeBy

 */
  return(
    <>
    <div className="flex items-center justify-center">
      Final result
    </div>    
    
    <div className="flex items-center justify-center">
      #{data.turnsCount} Turns in {data.gameTotalTime}s
    </div>
    
    <div className="flex items-center justify-center">

      <div>
        <div>Player 1</div>
        <div className={`${ data.looserId !== 0 ? "text-lime-500" : "text-red-500" }`}>{history.results[0]}</div>
      </div>


      <div>
        <div>Player 2</div>
        <div className={`${ data.looserId !== 1 ? "text-lime-500" : "text-red-500" }`}>{history.results[1]}</div>
      </div>

      </div>

      <div className="flex items-center justify-center">

<div>
  <div>{data.players[0].color} {data.players[0].format}</div>
  <div >      
    #{data.players[0].totalTurns} Turns in {data.players[0].totalTimeInSeconds}s
  </div>
</div>


<div>
<div>{data.players[1].color} {data.players[1].format}</div>
<div >      
    #{data.players[1].totalTurns} Turns in {data.players[1].totalTimeInSeconds}s
  </div>

    </div>
    </div>
    </>
  );
}

export default ClockResultGrid;