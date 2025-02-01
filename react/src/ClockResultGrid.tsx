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
    <div className="flex items-center justify-center text-3xl">
      Final result
    </div>    
    

    <div className="flex items-center justify-around text-center my-4">

      <div>
        <div className="text-xl">Player 1</div>
        <div className={`${ data.looserId !== 0 ? "text-lime-500" : "text-red-500" }`}>{history.results[0]}</div>

        <div className={`${ data.looserId !== 0 ? "text-lime-500" : "text-red-500" }`}>
        7+1
        </div>

        <div>{data.players[0].color} {data.players[0].format}</div>
        #{data.players[0].totalTurns} Turns in {data.players[0].totalTimeInSeconds}s

      </div>


      <div>
        <div className="text-xl">Player 2</div>
        <div className={`${ data.looserId !== 1 ? "text-lime-500" : "text-red-500" }`}>{history.results[1]}</div>
        <div className={`${ data.looserId !== 1 ? "text-lime-500" : "text-red-500" }`}>
        4+0
        </div>

        <div>{data.players[1].color} {data.players[1].format}</div>
<div >      
    #{data.players[1].totalTurns} Turns in {data.players[1].totalTimeInSeconds}s
  </div>
      </div>

      </div>

      <div className="flex items-center justify-center">

<div>
  <div >      
  </div>
</div>


<div>


    </div>

    
    </div>

    <div className="flex items-center justify-center">
      <div className="px-1 bg-light-brown rounded-md text-slate-900 text-sm">      #{data.turnsCount} Turns in {data.gameTotalTime}s
        <div>{data.gameTotalTime/data.turnsCount}s/turn</div>
      </div>
    </div>
    
    </>
  );
}

export default ClockResultGrid;