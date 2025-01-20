import { useState, useEffect, useRef} from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import './App.css'


type Player = {
  startTime: number,
  id : number,
  addiTime: number,
};

type starTimeRecom = {
  name: string,
  time : number,
};

function App() {
  const [isDialogOpen, setDialogOpen] = useState(true);
  const [isSamePlayTime, setSamePlayTime] = useState(true);
  const startTime = 10; const addiTime = 5;

  const startTimeRecom : starTimeRecom[] = [
    {
      name : "5m",
      time : 5,
    },

    {
      name : "10m",
      time : 10,
    },

    {
      name : "15m",
      time : 15,
    },


    {
      name : "30m",
      time : 30,
    },

    {
      name : "1h",
      time : 60,
    },


    {
      name : "1h30min",
      time : 90,
    },

    {
      name : "2h",
      time : 120,
    },
  ];
  const ps : Player[] = [
    {
      startTime: startTime,
      id : 1,
      addiTime: addiTime,
    }, 
    {
      startTime: startTime,
      id : 2,
      addiTime: addiTime,
    }
  ]
  const [players, setPlayers] = useState(ps);


  const getPlayerNode = (player: Player, showTitle : boolean) => {
    return (
    <div key={`player-${player.id}`} className="flex flex-col gap-y-2 my-4">
      {
        showTitle ? (
          <>
            <h2>player {player.id}</h2>
          </>
        ) : (<></>)
      }
      
      <hr className="block"/>
      
      <div className="flex w-full justify-center items-center space-x-2">
        {
          startTimeRecom.map(el=>
            <Button 
            className={`${el.time == player.startTime ? "bg-amber-950" : "bg-amber-900" }  hover:bg-amber-950 w-full`} 
            onClick={()=>setPlayTime(player.id, el.time)}>{el.name}</Button>
          )
        }

        </div>
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor="start-time" className="text-gray-100 w-28">start time</Label>
          <Input onChange={()=>{}} type="start-time" value={player.startTime} className="bg-slate-100 text-slate-900" placeholder="Minutes" />
          <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>setPlayTime(player.id, player.startTime+1)}>+</Button>
          <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>setPlayTime(player.id, player.startTime-1)}>-</Button>
        </div>


        {/* <div className="flex w-full items-center space-x-2">
          <Label htmlFor="addit-time" className="text-gray-100 w-28">addi. time</Label>
          <Input type="addit-time" className="bg-slate-100 text-slate-900" placeholder="Seconds" />
          <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>{}}>+</Button>
          <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>{}}>-</Button>
        </div> */}
        </div>
    );
  }

  const setPlayTime = (playerId: number, startTime: number) => {

    console.log("tt")
    if(startTime < 1 || startTime > 3*60){
      return;
    }


    const newPlayers = players;
    newPlayers.map((el)=>{
      if(el.id == playerId){
        el.startTime = startTime;
      }
      return el;
    })
    setPlayers(players);
    console.log("tt")
  }

  useEffect(()=>{
    
  },[isSamePlayTime])

  const setaddiTime = (playerIndex: number, addiTime: number) => {
    const newPlayers = players;
    newPlayers.map((el, index)=>{
      if(index == playerIndex){
        el.addiTime = addiTime;
      }
    })
    setPlayers(players);
  }

  return (
    <>
    <h1>hello there</h1>
      <AlertDialog  open={isDialogOpen}>

      <AlertDialogContent className="bg-slate-900 max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="capitalize text-center">The best chess clock</AlertDialogTitle>
          <AlertDialogDescription>
            
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex my-4 items-center justify-center space-x-2">
              <Switch onCheckedChange={(val)=>{setSamePlayTime(val)}} checked={isSamePlayTime} id="same-play-time-mode" />
              <Label htmlFor="same-play-time-mode" className="text-gray-100">same playtime</Label>
        </div>

        <div >

      {isSamePlayTime ? (
      <>hhh</>
    ) : 
      players.map((el)=> getPlayerNode(el, true))
    }
          <h2>player 1</h2>
          <hr className="block"/>

        <div className="flex w-full justify-center items-center space-x-2">
        <Button className="bg-amber-900 hover:bg-amber-950 w-full" onClick={()=>{}}>5</Button>
        <Button className="bg-amber-900 hover:bg-amber-950 w-full" onClick={()=>{}}>10</Button>
        <Button className="bg-amber-900 hover:bg-amber-950 w-full" onClick={()=>{}}>15</Button>
        <Button className="bg-amber-900 hover:bg-amber-950 w-full" onClick={()=>{}}>30</Button>
        <Button className="bg-amber-900 hover:bg-amber-950 w-full" onClick={()=>{}}>60</Button>
        <Button className="bg-amber-900 hover:bg-amber-950 w-full" onClick={()=>{}}>90</Button>
        <Button className="bg-amber-900 hover:bg-amber-950 w-full" onClick={()=>{}}>120</Button>

          </div>
          <div className="flex w-full items-center space-x-2">
            <Label htmlFor="start-time" className="text-gray-100 w-28">start time</Label>
            <Input type="start-time" className="bg-slate-100 text-slate-900" placeholder="Minutes" />
            <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>{}}>+</Button>
            <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>{}}>-</Button>
          </div>


          <div className="flex w-full items-center space-x-2">
            <Label htmlFor="addit-time" className="text-gray-100 w-28">addi. time</Label>
            <Input type="addit-time" className="bg-slate-100 text-slate-900" placeholder="Seconds" />
            <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>{}}>+</Button>
            <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>{}}>-</Button>
          </div>


        </div>
        <AlertDialogFooter>
            <AlertDialogAction className="bg-amber-900 w-full hover:bg-amber-950 capitalize">start game</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default App
