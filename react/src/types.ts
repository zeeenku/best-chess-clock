export type TimeRecom = {
    name: string,
    time : number,
};

export type Player = {
    startTime: number,
    id : number,
    addiTime: number,
};

export interface ClockProps {
    config : [Player, Player],
};