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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"



import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import './App.css'
import Clock from './Clock'
import { GamesHistory, Player } from './types'
import InfoFaq from './InfoFaq'
import ShareDialog from './ShareDialog'
import PlayerCustomConfig from './PlayerCustomConfig'



function App() {
  const url = window.location.href;
  const [isDialogOpen, setDialogOpen] = useState(true);
  const [isSamePlayTime, setSamePlayTime] = useState(true);
  const startTime = 10; const addiTime = 5;
  const [showClock,setShowClock] = useState(false);
  const history = useRef<GamesHistory>(new GamesHistory());


const restoreGame = () => {}




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
        <div className="flex lg:h-[100dvh] lg:max-h-[100dvh] w-full flex-col lg:flex-row lg:space-x-20 lg:px-20 
        overflow-x-auto justify-center items-start  lg:py-10">


<div className="bg-slate-950 w-full lg:sticky flex flex-col justify-center items-center h-fit max-h-full lg:top-0
                    lg:w-6/12 
                    pt-5 lg:py-3 pb-8 px-3 lg:px-8 rounded-lg
lg:max-h-full lg:overflow-y-auto ">


  <Tabs defaultValue="home" className="w-full">
      <TabsList className='w-full text-slate-100 bg-transparent justify-between'>
        
      <div className="flex justify-center text-sm items-center">      
              <img src="./logo.svg" className="w-9 me-2" width="2rem" height="2rem" />
            Best Chess Clock</div>

        <div className='flex '>
          <TabsTrigger className="text-xs" value="home">Home</TabsTrigger>
          <TabsTrigger className="text-xs" value="history">History</TabsTrigger>
        </div>
      </TabsList>
  
  
  <TabsContent value="home" className="flex flex-col justify-around items-center">
    


  <Carousel className="w-full">

  <h1 className="block lg:hidden text-md sm:text-2xl font-bold mx-auto mt-8 mb-4 w-11/12 text-center">Play Chess with the #1 Chess Timer App!</h1>
<h2 className="block lg:hidden text-sm  sm:text-xl text-semi-brown mx-auto mb-6 w-11/12 font-bold text-center"> <span>123,765,199</span> 
<span className="text-xs  sm:text-lg italic text-center"> games played</span>
</h2>

  <div className="flex items-center justify-center my-3 lg:my-0 space-x-2">

              <Switch onCheckedChange={(val)=>{setSamePlayTime(val)}} checked={isSamePlayTime} id="same-play-time-mode" />
              <Label htmlFor="same-play-time-mode" className="text-gray-100">same playtime</Label>
        </div>




      <CarouselContent >
        {(isSamePlayTime ? [players[0]] : players).map((player, id) => (
          <CarouselItem className='' key={id}>
            <div className={`px-2`}>

          {
          !isSamePlayTime ? (
            <div className='flex justify-center mt-4 space-x-4 items-center'> 

              <CarouselPrevious className="relative text-slate-900 w-4 h-4 m-0 left-0 translate-x-0 translate-y-0 top-0" />
              <h2 className="font-semibold text-sm text-center">Player {id+1}</h2>

              <CarouselNext className="relative text-slate-900 w-4 h-4 m-0 left-0 translate-x-0 translate-y-0 top-0" />
            </div>
          ) : 
            <></>
    

                
}
            

              <PlayerCustomConfig id={id} initData={player} onUpdateConfig={(id: number, p:Player)=>{
                setPlayers(ps=>{
                  const pps = ps.map((el,idd)=>(idd == id ? p : el ) ) as [Player, Player];
                  return pps;
                })
              }} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>


    </Carousel>
    


    <div className="flex w-10/12 mx-auto my-8 lg:my-1 gap-x-2">

    <div className="w-full">
    <Button onClick={()=>{}} className="w-full text-xs bg-slate-800 hover:bg-slate-800 text-white">Download App</Button>
    </div>

    <Button onClick={()=>startGame()}
    className="bg-semi-brown hover:bg-semi-brown w-full text-xs text-slate-900 capitalize my-0">Start Game
    </Button>




    <div className="w-full text-xs">
    <ShareDialog url={url} />
    </div>

    </div>
    <div >


    </div>

    </TabsContent>
  <TabsContent value="history" className="flex flex-col justify-around items-center">
    <div className='h-full max-h-full overflow-auto'>
    Change your password here.
    </div>
    </TabsContent>
</Tabs>


  
          
<div className="text-xs flex gap-1 mt-2 justify-between">
<span>Made by <a href="https://dev.zeenku.com" className="underline text-semi-brown">Zenku</a> (Enajjachi Zakariaa).</span>

  <span className="text-gray-300 text-center">&copy; 2025, Open Source Project (<a href="https://github.com/zeeenku/best-chess-clock" className="underline text-semi-brown">code</a>)</span>
</div>
        </div>

        <div className="w-full lg:w-6/12">
        <InfoFaq/>
        </div>
</div>

</>
      }


<AlertDialog  open={history.current.hasActiveGame()}>

<AlertDialogContent className="bg-slate-900 max-h-[95vh] overflow-x-hidden overflow-y-auto">
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
