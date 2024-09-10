import { useAuthContext } from "./useAuthContext";
import { useState } from "react";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('http://localhost:4000/api/users/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({email,password})
    })
    const data = await response.json()
    console.log(data)
    if(!response.ok){
        setIsLoading(false)
        setError(data.error)
    }
    if(response.ok){
        localStorage.setItem('user',JSON.stringify(data))
        dispatch({type:'LOGIN',payload:data})
        setIsLoading(false)
    }

  };
  return {login,isLoading,error}
};
