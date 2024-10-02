import React, { useState } from 'react'
import useServiceStore from '../../../store/serviceStore';

function BookService() {

    const [getService, setService] = useState();
    const [Errors, setErrors] = useState();

    const { fetchServices, error, isLoading } = useServiceStore();

    const submitHandler = async () => {
        try {
            const list = await fetchServices();

            if (!list) {
                setErrors("Front-end error !!");
            }

            setService(list[0]);
            console.log("list:::" , list[0]);
            console.log("service::::",  getService.name);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <button onClick={submitHandler}>see more</button>
            {/* {start ? getService.map((index, values) => (
                <p key={index}>{values}</p>
            )) : <p>Wait</p>} */}
            <p>service::{getService.name || "name"}</p> 
            <p>service::{getService.adminDetails.name || "kiska"}</p> 
        </div>
    )
}

export default BookService
