import { useState } from 'react'
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import './App.css'

function App() {
  const [isDialogOpen, setDialogOpen] = useState(true);
  const [isSamePlayTime, setSamePlayTime] = useState(true);

  return (
    <>
    <h1>hello there</h1>
      <AlertDialog  open={isDialogOpen}>

      <AlertDialogContent className="bg-slate-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="capitalize text-center">The best chess clock</AlertDialogTitle>
          <AlertDialogDescription>
            
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex my-4 items-center justify-center space-x-2">
              <Switch checked={isSamePlayTime} id="same-play-time-mode" />
              <Label htmlFor="same-play-time-mode" className="text-gray-100">same playtime</Label>
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex w-full items-center space-x-2">
            <Label htmlFor="start-time" className="text-gray-100">start time</Label>
            <Input type="start-time" className="bg-slate-100 text-slate-900" placeholder="Minutes" />
            <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>{}}>+</Button>
            <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>{}}>-</Button>
          </div>


          <div className="flex w-full items-center space-x-2">
            <Label htmlFor="addit-time" className="text-gray-100">addi. time</Label>
            <Input type="addit-time" className="bg-slate-100 text-slate-900" placeholder="Seconds" />
            <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>{}}>+</Button>
            <Button className="bg-amber-900 hover:bg-amber-950" onClick={()=>{}}>-</Button>
          </div>


        </div>
        <AlertDialogFooter className="block">
          <div className="flex w-full justify-between">
            <div>Developed & Designed By Zenku</div>
            <AlertDialogAction>start game</AlertDialogAction>
          </div>
         
          <div className="flex">
            Developer
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default App
