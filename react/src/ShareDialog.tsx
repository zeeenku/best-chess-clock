import { ShareSocial } from "react-share-social";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { FC } from "react";


interface Props{
    url : string;
}

const ShareDialog: FC<Props>= ({url }) => {

    return (
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
    );
}

export default ShareDialog;