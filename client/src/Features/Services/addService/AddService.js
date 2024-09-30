import React, { useState } from 'react'

export default function AddService() {
    const [addService, setService] = useState({
        name:'',
        description:'',
        startTime:'',
        endTime:'',
    });
  return (
    <div className="container">
        <form action="">
            {/* <input type="text" name="serviceName" id="serviceName" placeholder='Enter Service Name' value={} required /> */}
        </form>
    </div>
  )
}
