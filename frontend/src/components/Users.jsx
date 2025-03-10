import { useState } from "react"
import { Button } from "./Button"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Users = () => {
    // Replace with backend call
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(()=> {
        axios.get("http://localhost:3000/api/v1/user/bulk?filter="+ filter,{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        })
        .then(res => {
            const users = res.data.users
           setUsers(users);
        })
    },[filter]);

    return <>
        <div className="font-bold mt-6 text-lg">
            Transfer Money
        </div>
        <div className="my-2">
            <input onChange={(e)=> {
                setFilter(e.target.value)
            }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div>
            {users.map(user => <User user={user} />)}
        </div>
    </>
}

function User({user}) {
    const navigate = useNavigate();

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstname[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstname} {user.lastname}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={()=> {
                navigate("/send?id=" + user._id + "&name=" + user.firstname);
            }} label={"Send Money"} />
        </div>
    </div>
}