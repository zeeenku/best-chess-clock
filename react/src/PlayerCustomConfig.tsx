import { Label } from '@radix-ui/react-label';
import { FC, useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { startTimeRecom, addiTimeRecom } from './recoms';
import { Player } from './types'


interface Props {
    initData : Player;
    id : number;
    onUpdateConfig: CallableFunction;
}
const PlayTimeConfig : FC<Props> = ({initData, id, onUpdateConfig}) => {

    
    const [player, setPlayer] = useState(initData);
    
    

    const getBtnColors = () => {
        return "bg-slate-800 text-slate-100";
    }

    const getBtnFocusColors = () => {
        return "bg-semi-brown text-slate-900";
    }

    const getBtnHoverColors = () => {
        "hover:bg-semi-brown text-slate-900";
    }




    
    
    const setPlayTime = (startTime: number) => {
    
        // validate
        if(startTime < 1 || startTime > 3*60){
        return;
        }
    
    
        if(isNaN(startTime)){
        startTime = 1; 
        }
    
        setPlayer((p)=>{
            p.startTime = startTime;
            return p;
        });
        onUpdateConfig(player);
    }
    
    
    
    const setAddiTime =  (addiTime: number) => {
    
        // validate
        if(addiTime < 0 || addiTime > 60*2){
        return;
        }
    
        if(isNaN(addiTime)){
        addiTime = 0; 
        }
    
            // set by id
            setPlayer((p)=>{
                p.addiTime = addiTime;
                return p;
            });

        onUpdateConfig(id, player);
    }
    

    return (
        <div className="flex justify-center text-sm gap-x-8">
        <div className="w-6/12">
        <Label htmlFor="start-time" className="text-center mx-auto my-4 block text-gray-100 w-28">start time(m)</Label>
        <div className="flex max-w-full my-2 w-full flex-wrap justify-center items-center">
        {
            startTimeRecom.map( (el,index)=>
            <div className="p-0.5 w-1/3">
            <Button 

            key={index}
            size="sm"
            className={`${el.time == player.startTime ? getBtnFocusColors() : getBtnColors() }    } hover:bg-semi-brown hover:text-white text-semibold 
            text-[0.8rem] w-full h-auto aspect-square`} 
            onClick={()=>setPlayTime(el.time)}>{el.name}</Button>
            </div>
            )
        }

        </div>
        <div className="flex  mx-auto flex-nowrap items-center space-x-2">
            
            <div className="flex justify-center gap-x-1 items-center bg-slate-100 rounded-md p-1">
            <Input onChange={(e)=>setPlayTime(parseInt(e.target.value) )} type="start-time" value={player.startTime} 
            className="bg-light-brown border-none shadow-none h-6 focus:shadow-none text-slate-900" placeholder="Minutes" />
            <Button size="sm" className={`bg-semi-brown hover:bg-semi-brown text-slate-900 h-6`} onClick={()=>setPlayTime(player.startTime+1)}>+</Button>
            <Button size="sm" className={`bg-semi-brown hover:bg-semi-brown text-slate-900 h-6`} onClick={()=>setPlayTime(player.startTime-1)}>-</Button>
            </div>



        </div>

        </div>

<div className="w-6/12">
<Label htmlFor="start-time" className="text-center mx-auto my-4 block text-gray-100 w-28">Addi. time(s)</Label>

<div className="flex max-w-full w-full flex-wrap justify-center items-center">
{
            addiTimeRecom.map((el,index)=>
            <div className="p-0.5 w-1/3">
            <Button 
            key={index}
            className={`${el.time == player.addiTime ? getBtnFocusColors() : getBtnColors() } hover:bg-semi-brown hover:text-white  
            text-semibold
            text-[0.8rem] w-full h-auto aspect-square`} 
            onClick={()=>setAddiTime(el.time)}>{el.name}</Button>
            </div>
            )
        }

        </div>
        <div className="flex mx-auto flex-nowrap items-center space-x-2">

        <div className="flex my-2 justify-center gap-x-1 items-center bg-slate-100 rounded-md p-1">
            <Input onChange={(e)=>setAddiTime(parseInt(e.target.value) )} type="start-time" value={player.addiTime} 
            className=" border-none shadow-none h-6 focus:shadow-none text-slate-900" placeholder="Seconds" />
            <Button size="sm" className={`bg-semi-brown hover:bg-semi-brown text-slate-900 h-6`} onClick={()=>setAddiTime(player.addiTime+1)}>+</Button>
            <Button size="sm" className={`bg-semi-brown hover:bg-semi-brown text-slate-900 h-6`} onClick={()=>setAddiTime(player.addiTime-1)}>-</Button>
            </div>
            </div>
        </div>
        </div>
    );
}

export default PlayTimeConfig;