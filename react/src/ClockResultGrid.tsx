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
      #{data.turnsCount} Turns in {data.gameTotalTime}
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
      {Object.keys(data)}
    </div>
    </>
  );
}

export default ClockResultGrid;