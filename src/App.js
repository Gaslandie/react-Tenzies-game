import React, { useState } from "react";
import Box from "./components/Box";
import Header from "./components/Header";

function App() {
    const [boxesContentArray,setBoxesContentArray] = useState(generateNumber())
    function generateNumber(){
        const boxNumbers = []
        for (let i=0;i<10;i++){
            boxNumbers.push(Math.floor(Math.random()*6)+1)
        }
        
        return boxNumbers
    }
    function newBoxNumbers(){
        setBoxesContentArray(generateNumber())
    }
    
    const box = boxesContentArray.map((boxContent,index)=> <Box key={index} value={boxContent} />)




  return (
    
    <div className="container  border border-2 border-prirmary text-center">
        <Header />
        <div className="col">
            <div className="boxes mt-5">
                {box}
            </div>
        </div>
        <button className="btn mt-4" onClick={newBoxNumbers}>Roll</button>
    </div>
  );
}

export default App;
