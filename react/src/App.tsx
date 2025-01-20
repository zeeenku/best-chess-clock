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
              <Switch checked={isSamePlayTime} id="airplane-mode" />
              <Label htmlFor="same-play-time-mode" className="text-gray-100">same playtime</Label>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default App
