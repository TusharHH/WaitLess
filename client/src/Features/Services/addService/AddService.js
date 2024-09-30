import React, { useState } from 'react'

export default function AddService() {
    const [addService, setService] = useState({
        name:'',
        description:'',
        startTime:'',
        endTime:'',
        serviceSlotTime:''
    });
  return (
    <div className="container">
        <form action="">
            
        </form>
    </div>
  )
}