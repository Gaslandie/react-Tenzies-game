import React, { useEffect, useRef, useState } from "react";
import Box from "./components/Box";
import Header from "./components/Header";
import { nanoid } from "nanoid"; //pour nous generer des id
import Confetti from 'react-confetti'; //pour le confetti à la fin de jeu, feliciter la victoire
import clickSound from './assets/clickSound.wav'
import confettiSound from './assets/fireWork.mp3'

function App() {
    const [boxesContent,setBoxesContent] = useState(generateNumber()) //pour gerer letat du contenu de nos boxs
    const [tenzies,setTenzies] = useState(false) //lorsque toutes les boxs ont la meme valeur ou pas, gerer cet etat
    const confettiAudio = useRef(new Audio(confettiSound)) //gerer letat de notre audio,qui ne cause pas de rendu

    function generateNumber(){ //fonction pour generer 10 nombre entre 0 et 6 comme pour un dé
        const boxNumbers = []
        for (let i=0;i<10;i++){
            boxNumbers.push({value:Math.floor(Math.random()*6)+1,
                            isHeld:false,
                            id:nanoid()
            })
        }
        
        return boxNumbers
    }
    //fonctions pour generer le son au click et du son pour le confetti
    function playSound(){
        new Audio(clickSound).play()
    }
    //pour jouer le son au moment du confetti
    function playFireWorkSound(){
        confettiAudio.current.play();
    }
    //arreter le son quand on clique sur nouveau jeu
    function stopFireWorkSound(){
        confettiAudio.current.pause()
        confettiAudio.current.currentTime = 0;
    }
    //generer de nouveaux nombre à chaque fois qu'on clique sur le boutton Lancer sauf pour les boites sur les quelles on a deja cliqué
    function newBoxNumbers(){
        
        if(!tenzies){
            setBoxesContent(prevBoxesContent => prevBoxesContent.map(prevBoxe=>{
                return prevBoxe.isHeld === false?{...prevBoxe,id:nanoid(),value:Math.floor(Math.random()*6)+1}:prevBoxe
            }))
        }else{
            setTenzies(false)
            setBoxesContent(generateNumber)
        }
        
    }

    //lorsqu'on clique sur un dé ou une boxe changer son isheld à !isheld
    function holdDice(id){
        playSound()
      setBoxesContent(prevBoxesContent =>prevBoxesContent.map(prevBoxe=>{
        return prevBoxe.id === id ? {...prevBoxe,isHeld: !prevBoxe.isHeld} :  prevBoxe
      })) 
    }
    
    //pour chacune de nos box
    const box = boxesContent.map((boxContent)=> <Box 
                                                        key={boxContent.id} 
                                                        value={boxContent.value} 
                                                        isHeld={boxContent.isHeld} 
                                                        holdDice={()=>holdDice(boxContent.id)}
                                    />)

    //à chaque fois qu'il ya un changement au niveau de l'une de nos boxe, verifier si toutes les valeurs sont les memes et si toutes les
    //boxes ont pour isheld true,pour pouvoir declarer vainqueur notre joueur
    useEffect(()=>{
        const allHeld=boxesContent.every(boxe => boxe.isHeld)
        const sameValue=boxesContent[0].value
        const allSameValue = boxesContent.every(boxe => boxe.value === sameValue)
        if(allHeld && allSameValue){
            setTenzies(true)
            playFireWorkSound()
        }else{
            stopFireWorkSound()
        }
    },[boxesContent])

    


  return (
    <div className="container  border border-2 border-prirmary text-center">
        {tenzies && <Confetti />} 
        <Header />
        <div className="col">
            <div className="boxes mt-5">
                {box}
            </div>
        </div>
        <button className="btn mt-4" onClick={ newBoxNumbers}>{tenzies?"Nouveau Jeu":"Lancer"}</button>
    </div>
  );
}

export default App;
