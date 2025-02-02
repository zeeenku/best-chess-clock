import { useRef, useState} from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
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



function App() {
  const url = window.location.href;
  const [isDialogOpen, setDialogOpen] = useState(true);
  const [isSamePlayTime, setSamePlayTime] = useState(true);
  const startTime = 10; const addiTime = 5;
  const [showClock,setShowClock] = useState(false);
  const history = useRef<GamesHistory>(new GamesHistory());




  const getBtnBgColor = (id : number) => {
    if(id == 0) return "bg-amber-900";
    return "bg-lime-900"
  }

  const getBtnFocusBgColor = (id : number) => {
    if(id == 0) return "bg-amber-950";
    return "bg-lime-950"
  }

  const getBtnHoverBgColor = (id : number) => {
    if(id == 0) return "hover:bg-amber-950";
    return "hover:bg-lime-950"
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
  history.current.hasActiveGame() ? "active el exists" : "hh" 
}
      {
        showClock ? <Clock config={players} onReturnToHome={()=>{setDialogOpen(true); setShowClock(false);}} /> : <></>
      }

      <AlertDialog  open={isDialogOpen}>

      <AlertDialogContent className="bg-slate-900 max-h-[90vh] overflow-x-hidden overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="capitalize text-center">The best chess clock</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300 text-center">
          </AlertDialogDescription>
        </AlertDialogHeader>

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
                  <h2 className="font-semibold text-md mt-6 text-center">Player {id}</h2>
                </>
              ) : (<></>)
            }
            

            
            <div className="flex gap-x-2 mb-4">
            <div className="w-1/2">
            <Label htmlFor="start-time" className="text-center mx-auto my-4 block text-gray-100 w-28">start time(m)</Label>
            <div className="flex max-w-full my-2 w-full flex-wrap justify-center items-center gap-1">
              {
                startTimeRecom.map( (el,index)=>
                  <Button 
                  key={index}
                  size="sm"
                  className={`${el.time == player.startTime ? getBtnFocusBgColor(id) : getBtnBgColor(id) }  ${getBtnHoverBgColor(id)} text-xs w-12 h-8`} 
                  onClick={()=>setPlayTime(id, el.time)}>{el.name}</Button>
                )
              }
      
              </div>
              <div className="flex w-10/12 mx-auto flex-nowrap items-center space-x-2">
                
                <div className="flex justify-center gap-x-1 items-center bg-slate-100 rounded-md p-1">
                  <Input onChange={(e)=>setPlayTime(id, parseInt(e.target.value) )} type="start-time" value={player.startTime} 
                  className=" border-none shadow-none h-6 focus:shadow-none text-slate-900" placeholder="Minutes" />
                  <Button size="sm" className={`${getBtnBgColor(id)} ${getBtnHoverBgColor(id)} h-6`} onClick={()=>setPlayTime(id, player.startTime+1)}>+</Button>
                  <Button size="sm" className={`${getBtnBgColor(id)} ${getBtnHoverBgColor(id)} h-6`} onClick={()=>setPlayTime(id, player.startTime-1)}>-</Button>
                </div>



              </div>
      
              </div>

<div className="w-1/2">
<Label htmlFor="start-time" className="text-center mx-auto my-4 block text-gray-100 w-28">Addi. time(s)</Label>

<div className="flex max-w-full w-full flex-wrap justify-center items-center gap-1">
{
                addiTimeRecom.map((el,index)=>
                  <Button 
                key={index}
                  className={`${el.time == player.addiTime ? getBtnFocusBgColor(id) : getBtnBgColor(id) }  ${getBtnHoverBgColor(id)} text-xs w-12 h-8`} 
                  onClick={()=>setAddiTime(id, el.time)}>{el.name}</Button>
                )
              }

              </div>
              <div className="flex w-10/12 mx-auto flex-nowrap items-center space-x-2">

              <div className="flex w- my-2 justify-center gap-x-1 items-center bg-slate-100 rounded-md p-1">
                  <Input onChange={(e)=>setAddiTime(id, parseInt(e.target.value) )} type="start-time" value={player.addiTime} 
                  className=" border-none shadow-none h-6 focus:shadow-none text-slate-900" placeholder="Seconds" />
                  <Button size="sm" className={`${getBtnBgColor(id)} ${getBtnHoverBgColor(id)} h-6`} onClick={()=>setAddiTime(id, player.addiTime+1)}>+</Button>
                  <Button size="sm" className={`${getBtnBgColor(id)} ${getBtnHoverBgColor(id)} h-6`} onClick={()=>setAddiTime(id, player.addiTime-1)}>-</Button>
                </div>
                </div>
              </div>
              </div>
              <hr className="block"/>
              </div>

              
        )
      }

        </div>

        <div>
            <AlertDialogAction
            onClick={()=>startGame()}
            className="bg-amber-900 w-full hover:bg-amber-950 capitalize my-0">start game</AlertDialogAction>


        <div className="flex my-2 gap-x-2">
          <div className="w-full">
          <Button onClick={()=>{}} className="w-full bg-lime-900 hover:bg-lime-950">Download as App</Button>
          </div>
          <div className="w-full">
          <Dialog>
              <DialogTrigger asChild className="w-full">          
                <Button className="w-full bg-lime-900 hover:bg-lime-950">Share With Friends</Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900">
                <DialogHeader>
                  <DialogTitle>Thanks for sharing</DialogTitle>
                  <DialogDescription>
                  <ShareSocial 
                          url={url}

                          style={{
                            root: {
                              backgroundColor: "transparent",
                              fontFamily : "\"Arvo\", serif"
                            },

                            title : {
                              textAlign : "center",
                              color : "#e2e8f0",
                              fontSize: "1rem",
                              fontFamily : "\"Arvo\", serif"
                            },
                            copyContainer: {
                              fontFamily : "\"Arvo\", serif",
                              transform: "scale(0.8)"
                            }
                          }}

                          socialTypes={["whatsapp","facebook","twitter","reddit","linkedin","instapaper"]}
                        />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
          </Dialog>
          </div>

          </div>
        <div className="text-xs flex gap-1 justify-center">
        <span>&copy; made by <a href="https://dev.zeenku.com" className="underline text-amber-700">Zenku</a> (Enajjachi Zakariaa).</span>

          <span className="text-gray-300 text-center">You can read the code (<a href="https://github.com/zeeenku/best-chess-clock" className="underline text-amber-700">repo</a>)</span>
        </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default App
