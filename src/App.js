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
    const [timeElapsed,setTimeElapsed] = useState(0)
    const [timerOn,setTimerOn] = useState(false)
    const [gameStarted,setGameStarted] = useState(false)
    const [bestTime,setBestTime] = useState(Infinity)

    // Charger le record du LocalStorage
    useEffect(() => {
        const savedRecord = localStorage.getItem("recordTenzies");
        if (savedRecord) {
            setBestTime(Number(savedRecord));
        }
    }, []);

    // Sauvegarder le record dans le LocalStorage
    useEffect(() => {
        if (bestTime !== Infinity) {
            localStorage.setItem("recordTenzies", bestTime.toString());
        }
    }, [bestTime]);

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
            setBoxesContent(generateNumber())
            setGameStarted(false)
            setTimerOn(false)
            setTimeElapsed(0)
        }
        
    }

    //lorsqu'on clique sur un dé ou une boxe changer son isheld à !isheld
    function holdDice(id){
        if(!gameStarted){
            setGameStarted(true);
            setTimerOn(true);//pour demarrer le chronomètre
        }
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
    //boxes ont pour isheld true,pour pouvoir declarer vainqueur notre joueur.s'il est vainqueur verifier s'il a battu son record ou pas
    useEffect(()=>{
        const allHeld=boxesContent.every(boxe => boxe.isHeld)
        const sameValue=boxesContent[0].value
        const allSameValue = boxesContent.every(boxe => boxe.value === sameValue)
        if(allHeld && allSameValue){
            setTenzies(true)
            playFireWorkSound()
            setTimerOn(false)
            if(timeElapsed < bestTime){
                setBestTime(timeElapsed)
                // setTimeElapsed(0)
            }
        }else{
            stopFireWorkSound()
        }
    },[boxesContent,bestTime,timeElapsed])

    //gestion de letat de notre temps ecoulé en fonction de letat du jeu,si le chrono a demarré ou pas
    useEffect(()=>{
        let interval;

        if(timerOn){
            interval = setInterval(()=>{
                setTimeElapsed(prevTime => prevTime + 1)
            },1000)
        }else if(!timerOn){
            clearInterval(interval)
        }

        return ()=>clearInterval(interval)
    },[timerOn])


  return (
    <div className="container  border border-2 border-prirmary text-center">
        {tenzies && <Confetti />} 
        <Header />
        <div className="col">
            <div className="boxes mt-5">
                {box}
            </div>
        </div>
        <div className="lancer-record-ecoule mt-4 d-flex justify-content-md-evenly justify-content-between">
            <span className="time-elapsed ms-2 fw-bold">Temps ecoulé: {timeElapsed}sec</span>
            <button className="btn" onClick={ newBoxNumbers}>{tenzies?"Nouveau Jeu":"Lancer"}</button>
            <span className="record me-2 fw-bold">Record: {bestTime === Infinity ?"" : bestTime + "sec"}</span>
        </div>
        
    </div>
  );
}

export default App;
