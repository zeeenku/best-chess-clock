import { useRef, useState} from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {addiTimeRecom, startTimeRecom} from "@/recoms"


import {ShareSocial} from 'react-share-social' 


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import './App.css'
import Clock from './Clock'
import { GamesHistory, Player } from './types'
import InfoFaq from './InfoFaq'
import ShareDialog from './ShareDialog'



function App() {
  const url = window.location.href;
  const [isDialogOpen, setDialogOpen] = useState(true);
  const [isSamePlayTime, setSamePlayTime] = useState(true);
  const startTime = 10; const addiTime = 5;
  const [showClock,setShowClock] = useState(false);
  const history = useRef<GamesHistory>(new GamesHistory());


const restoreGame = () => {}




  const getBtnColors = (id : number) => {
    if(id == 0) return "bg-slate-800 text-slate-100";
    return "bg-slate-100 text-slate-900"
  }

  const getBtnFocusColors = (id : number) => {
    if(id == 0) return "bg-semi-brown text-slate-900";
    return "bg-slate-200 text-slate-900"
  }

  const getBtnHoverColors = (id : number) => {
    if(id == 0) return "hover:bg-semi-brown text-slate-900";
    return "hover:bg-slate-200 text-slate-900"
  }





  const ps: [Player, Player] =  [
    {
    startTime: startTime,
    addiTime: addiTime,
    }, 
    {
    startTime: startTime,
    addiTime: addiTime,
    }
];

  const [players, setPlayers] = useState(ps);



  const setPlayTime = (playerId: number, startTime: number) => {

    // validate
    if(startTime < 1 || startTime > 3*60){
      return;
    }


    if(isNaN(startTime)){
      startTime = 1; 
    }


    // set by id
    const newPlayers = players.map((el, index)=>{
      if(index == playerId){
        el.startTime = startTime;
      }
      return el;
    }) as [Player , Player];

    setPlayers(newPlayers);
  }


  
  const setAddiTime =  (playerId: number, addiTime: number) => {

    // validate
    if(addiTime < 0 || addiTime > 60*2){
      return;
    }

    if(isNaN(addiTime)){
      addiTime = 0; 
    }

        // set by id
    const newPlayers = players.map((el, index)=>{
      if(index == playerId){
        el.addiTime = addiTime;
      }
      return el;
    }) as [Player , Player];
    setPlayers(newPlayers);
}

  

  const startGame = () => {
    if(isSamePlayTime){
      // if same then change second player data as the first one
      players[1] = {...players[0]};
    }

    setDialogOpen(false);
    setShowClock(true);
  }
  



  return (
    <>


{
        showClock ? <Clock config={players} onReturnToHome={()=>{setDialogOpen(true); setShowClock(false);}} /> :
        <>
        <div className="flex h-[100dvh] w-full flex-col lg:flex-row lg:space-x-20 lg:px-20 overflow-x-auto justify-center items-start  p-10">
                    <div className="w-full flex justify-between items-center  h-screen
                    flex-col lg:w-6/12 bg-slate-950 lg:top-0 lg:sticky lg:max-h-full lg:overflow-x-auto 
                    p-5 lg:h-full rounded-lg">

  <div className="flex justify-center items-center">      
    <img src="./logo.svg" className="w-12 me-4" width="2rem" height="2rem" />
  Best Chess Clock</div>


                    <div className="flex items-center justify-center space-x-2">
              <Switch onCheckedChange={(val)=>{setSamePlayTime(val)}} checked={isSamePlayTime} id="same-play-time-mode" />
              <Label htmlFor="same-play-time-mode" className="text-gray-100">same playtime</Label>
        </div>

        <div >


      {
          (isSamePlayTime ? [players[0]] : players).map( (player, id) =>
          <div key={`player-${id}`} >
            {
              !isSamePlayTime ? (
                <>
                  <h2 className="font-semibold text-slate-900 text-md mt-6 text-center">Player {id}</h2>
                </>
              ) : (<></>)
            }
            

            
            <div className="flex justify-center gap-x-6 mb-4">
            <div className="w-5/12">
            <Label htmlFor="start-time" className="text-center mx-auto my-4 block text-gray-100 w-28">start time(m)</Label>
            <div className="flex max-w-full my-2 w-full flex-wrap justify-center items-center">
              {
                startTimeRecom.map( (el,index)=>
                  <div className="p-0.5 w-1/3">
                  <Button 
  
                  key={index}
                  size="sm"
                  className={`${el.time == player.startTime ? getBtnFocusColors(id) : getBtnColors(id) }   
                  ${getBtnHoverColors(id)} text-semibold 
                  text-sm w-full h-auto aspect-square`} 
                  onClick={()=>setPlayTime(id, el.time)}>{el.name}</Button>
                  </div>
                )
              }
      
              </div>
              <div className="flex  mx-auto flex-nowrap items-center space-x-2">
                
                <div className="flex justify-center gap-x-1 items-center bg-slate-100 rounded-md p-1">
                  <Input onChange={(e)=>setPlayTime(id, parseInt(e.target.value) )} type="start-time" value={player.startTime} 
                  className="bg-light-brown border-none shadow-none h-6 focus:shadow-none text-slate-900" placeholder="Minutes" />
                  <Button size="sm" className={`bg-semi-brown text-slate-900 h-6`} onClick={()=>setPlayTime(id, player.startTime+1)}>+</Button>
                  <Button size="sm" className={`bg-semi-brown text-slate-900 h-6`} onClick={()=>setPlayTime(id, player.startTime-1)}>-</Button>
                </div>



              </div>
      
              </div>

<div className="w-5/12">
<Label htmlFor="start-time" className="text-center mx-auto my-4 block text-gray-100 w-28">Addi. time(s)</Label>

<div className="flex max-w-full w-full flex-wrap justify-center items-center">
{
                addiTimeRecom.map((el,index)=>
                  <div className="p-0.5 w-1/3">
                  <Button 
                key={index}
                  className={`${el.time == player.addiTime ? getBtnFocusColors(id) : getBtnColors(id) }  ${getBtnHoverColors(id)}  
                  text-semibold
                  text-sm w-full h-auto aspect-square`} 
                  onClick={()=>setAddiTime(id, el.time)}>{el.name}</Button>
                  </div>
                )
              }

              </div>
              <div className="flex mx-auto flex-nowrap items-center space-x-2">

              <div className="flex my-2 justify-center gap-x-1 items-center bg-slate-100 rounded-md p-1">
                  <Input onChange={(e)=>setAddiTime(id, parseInt(e.target.value) )} type="start-time" value={player.addiTime} 
                  className=" border-none shadow-none h-6 focus:shadow-none text-slate-900" placeholder="Seconds" />
                  <Button size="sm" className={`bg-semi-brown text-slate-900 h-6`} onClick={()=>setAddiTime(id, player.addiTime+1)}>+</Button>
                  <Button size="sm" className={`bg-semi-brown text-slate-900 h-6`} onClick={()=>setAddiTime(id, player.addiTime-1)}>-</Button>
                </div>
                </div>
              </div>
              </div>
              <hr className="block"/>
              </div>

              
        )
      }
                    <div className="flex my-2 gap-x-2">

          <div className="w-full">
            <Button onClick={()=>{}} className="w-full bg-slate-800 hover:bg-slate-800 text-white">Download as App</Button>
          </div>

            <Button onClick={()=>startGame()}
              className="bg-semi-brown hover:bg-semi-brown w-full text-slate-900 capitalize my-0">start game
            </Button>




          <div className="w-full">
            <ShareDialog url={url} />
          </div>
          
        </div>
</div>
          
<div className="text-xs flex gap-1 justify-center">
<span>&copy; made by <a href="https://dev.zeenku.com" className="underline text-semi-brown">Zenku</a> (Enajjachi Zakariaa).</span>

  <span className="text-gray-300 text-center">You can read the code (<a href="https://github.com/zeeenku/best-chess-clock" className="underline text-semi-brown">repo</a>)</span>
</div>
        </div>


        <div className="w-full lg:w-6/12">
        <InfoFaq/>
        </div>
</div>

</>
      }


<AlertDialog  open={history.current.hasActiveGame()}>

<AlertDialogContent className="bg-slate-900 max-h-[90vh] overflow-x-hidden overflow-y-auto">
  <AlertDialogHeader>
    <AlertDialogTitle className="capitalize text-center">
The best chess clock</AlertDialogTitle>
    <AlertDialogDescription className="text-gray-300 text-center">
      Continue from last time?
    </AlertDialogDescription>
  </AlertDialogHeader>

<AlertDialogFooter>
<AlertDialogCancel>
      <Button className="bg-light-brown hover:bg-light-brown text-slate-900">Cancel</Button>
    </AlertDialogCancel>
    <AlertDialogAction className="bg-semi-brown hover:bg-semi-brown text-slate-900" onClick={restoreGame}>Yes Please</AlertDialogAction>
  
</AlertDialogFooter>

</AlertDialogContent>
</AlertDialog>
    </>

);
}

export default App
