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
    <div className="flex items-center justify-center ">
      <div className="w-10/12 p-2 rounded-md bg-semi-brown">
      <h2 className="text-center text-2xl">Game result</h2>
      <h3>Decided by {data.gameResultDecision}</h3>
      <div className="flex mt-5 justify-around">
        <div>
          <h3>Total Turns</h3>
          <div>{data.turnsCount}</div>
        </div>

        <div>
          <h3>Avg time/move </h3>
          <div>
            {(((data.players[0].totalTimeInSeconds/data.players[0].totalTurns) + (data.players[1].totalTimeInSeconds/data.players[1].totalTurns) ) /2).toFixed(2)} s/m
          
          </div>
        </div>

        <div>
          <h3>Total Time</h3>
          <div>{data.gameTotalTime}m</div>
        </div>
      </div>
      </div>
    </div>    
    


    <div className="flex items-center justify-around text-center my-4">

      <div className={`${data.players[0].color == 'white' ? 'bg-light-brown text-slate-900' : 'bg-slate-950 text-white'} *:
      p-2 rounded-md w-1/3
      `}>
        <div className="text-lg">Player 1 ({data.players[0].totalTurns}t)</div>
        <div className={`${ data.gameResult !== 0 ? "text-lime-600" : "text-red-500" } text-3xl my-2`}>
          {history.results[0]}
          <span className="text-lg"> +0</span>
          </div>


<div className="flex justify-between items-end">
<div className="text-xs bg-brown text-white rounded-md px-1">{(data.players[0].totalTimeInSeconds/data.players[0].totalTurns).toFixed(2)} s/m</div>

<div className="text-xs bg-brown text-white rounded-md px-1">{data.players[0].format}</div>

</div>
        {/* #{data.players[0].totalTurns} Turns in {data.players[0].totalTimeInSeconds}s */}

      </div>


      <div className={`${data.players[1].color == 'white' ? 'bg-light-brown text-slate-900' : 'bg-slate-950 text-white'} *:
      p-2 rounded-md w-1/3
      `}>
        <div className="text-lg">Player 2</div>
        <div className={`${ data.gameResult !== 1 ? "text-lime-500" : "text-red-500" } text-3xl`}>
          {history.results[1]}
          <span className="text-lg"> +0</span>
          </div>


        <div className="text-xl">{data.players[1].format}</div>
<div >      
    {/* #{data.players[1].totalTurns} Turns in {data.players[1].totalTimeInSeconds}s */}
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