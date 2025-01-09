import { useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useEffect } from "react"
import axios from "axios"

export const Dashboard = ()=> {
    const [value, setValue] = useState(0);

    useEffect(()=> {
        axios.get("http://localhost:3000/api/v1/account/balance", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            const amount = Math.round(res.data.balance)
            setValue(amount)
        });
    }, []);

    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={value} />
            <Users/>
        </div>
    </div>
}