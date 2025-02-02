import { FC } from "react";
import { GamesHistory, ClockResultGridProps, GameResults } from "./types";

const ClockResultGrid: FC<ClockResultGridProps> = ({ data }) => {



  const history = (new GamesHistory()).data;
  
/**
 * 
 * playerslooserIdturnsCountgameTotalTimegameEndTimeresultMadeBy

 */

const getResult = (res: GameResults) => {
  if(res === GameResults.draw ){
    return "Draw";
  }

  return `Player ${res === GameResults.player_1_lost ? 1 : 2} Won`;
}
  return(
    <>
    <div className="flex items-center justify-center ">
      <div className="w-10/12 p-2 rounded-md">
      <h2 className="text-center text-2xl">
        {getResult(data.gameResult!)}
      </h2>

      <h3 className="text-center text-semi-brown">by {data.gameResultDecision}</h3>

      </div>
    </div>    
    


    <div className="flex items-center justify-center space-x-6 text-center my-4">

    {data.players.map((el,id)=>(
       <div className={`${el.color == 'white' ? 'bg-[#e0cbbf] text-slate-900' : 'bg-slate-950 text-white'} 
       p-2 rounded-md w-1/3
       `}>
         <div className="text-lg">Player {id+1} <span className="text-sm">({el.totalTurns}m)</span></div>
         <div className={`${ data.gameResult !== id ? "text-lime-600" : "text-red-500" } text-3xl my-2`}>
           {history.results[id]}
           <span className="text-lg"> +0</span>
           </div>
 
 
 <div className="flex justify-between items-end">
 <div  className={`${el.color == 'white' ? 'bg-brown text-white' : 'text-slate-900 bg-white'} text-xs  rounded-md px-1`}
 >
  {(el.totalTimeInSeconds/el.totalTurns).toFixed(2)} s/m</div>
 
 <div 
 className={`${el.color == 'white' ? 'bg-brown text-white' : 'text-slate-900 bg-white'} text-xs  rounded-md px-1`}
 >{el.format}</div>
 
 </div>
         {/* #{el.totalTurns} Turns in {el.totalTimeInSeconds}s */}
 
       </div>
    ))}



      </div>

      <div className="flex items-center justify-center">

<div>
  <div >      
  </div>
</div>


<div>


    </div>

    
    </div>

    <div className="flex mb-5 justify-center space-x-8">
        <div className="text-center">
          <h3 className="text-sm">Total Turns</h3>
          <div>{data.turnsCount}</div>
        </div>

        <div className="text-center">
          <h3 className="text-sm">Avg time/move </h3>
          <div>
            {(((data.players[0].totalTimeInSeconds/data.players[0].totalTurns) + (data.players[1].totalTimeInSeconds/data.players[1].totalTurns) ) /2).toFixed(2)} s/m
          
          </div>
        </div>

        <div className="text-center"> 
          <h3 className="text-sm">Total Time</h3>
          <div>{data.gameTotalTime}m</div>
        </div>
      </div>
    
    </>
  );
}

export default ClockResultGrid;