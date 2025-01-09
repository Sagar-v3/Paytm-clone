import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import axios from 'axios'


export const Signup = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    return(
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign up"}/>
                <SubHeading label={"Enter your information to create an account"}/>
                <InputBox onChange={(e)=> setFirstname(e.target.value)} label={"First Name"} placeholder={"John"}/>

                <InputBox onChange={(e)=> setLastname(e.target.value)} label={"Last Name"} placeholder={"Doe"}/>

                <InputBox onChange={(e)=> setUsername(e.target.value)} label={"Email"} placeholder={"example@gmail.com"}/>

                <InputBox onChange={(e)=> setPassword(e.target.value)} label={"Password"} placeholder={"123456"}/>

                <div className="pt-4">
                    <Button onClick={async ()=> {
                        try {
                            const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
                                username,
                                firstname,
                                lastname,
                                password,
                            });
                            localStorage.setItem("token", response.data.token)
                            navigate('/dashboard');
                        } catch (error) {
                            console.log(error);
                        }
                        
                    }} label={"Sign up"}/>
                </div>
                <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/"}/>
                </div>
            </div>
        </div>
    )
}