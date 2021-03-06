import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import ErrorNotice from "../misc/ErrorNotice";

function Register () {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [displayName, setDisplayName] = useState();
    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext);
    const history = useHistory();
    const favPokemon = [""];

    const submit = async (e) => {
        e.preventDefault();

        try{
            const newUser = {email, password, passwordCheck, displayName, favPokemon};
            console.log(newUser);
            await axios.post("https://minipokedexbackend.herokuapp.com/users/register", newUser);
            const loginResponse = await axios.post("https://minipokedexbackend.herokuapp.com/users/login", {
                email, password
            });
            console.log(loginResponse.data);
            setUserData({
                token: loginResponse.data.token,
                user: loginResponse.data.user
            });
            localStorage.setItem("auth-token", loginResponse.data.token);
            history.push("/login");
        } catch(err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
        
    };
   
    return ( 
        <div className="register">
            <h2>Register</h2>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
            <form onSubmit={submit}>
                <label>Email: </label>
                <input type="email" id="email" onChange={e => setEmail(e.target.value)}/>
                <label>Password: </label>
                <input type="password" id="password" onChange={e => setPassword(e.target.value)}/>
                <input type="password" placeholder="Confirm password" onChange={e => setPasswordCheck(e.target.value)}/>
                <label>Display name </label>
                <input type="text" id="dsplay-name" onChange={e => setDisplayName(e.target.value)}/>
                <input type="submit" value="Register" className="btn btn-primary" />
            </form>
        </div>
        );
}
 
export default Register;