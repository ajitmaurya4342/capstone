import {createContext,useContext,useState} from 'react';
const AuthContext=createContext();
export function AuthProvider({children}){const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('busgo_user')||'null'));
 const login=(data)=>{localStorage.setItem('busgo_token',data.token);localStorage.setItem('busgo_user',JSON.stringify(data));setUser(data)};
 const logout=()=>{localStorage.removeItem('busgo_token');localStorage.removeItem('busgo_user');setUser(null)};
 return <AuthContext.Provider value={{user,login,logout}}>{children}</AuthContext.Provider>}
export const useAuth=()=>useContext(AuthContext);
