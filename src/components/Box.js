import React from 'react'

export default function Box(props) {
    const styles ={
        backgroundColor: props.isHeld ? "#25e6b5 ":"white"
    }
  return (
         <div className="box" 
              style={styles}
              onClick={props.holdDice}>
            {props.value}
         </div>
  )
}
