import { serverRequest } from ".";
import { Response } from "./api";
import { User } from "./provider";

interface Credential {
    email: string;
    password: string;
    remember: boolean;
}

export const registerUser = async (data:  Credential) : Promise<Response> => {
    const response = await serverRequest("post", "auth/signup", data, "json");
    return response;
}
export const Login = async (data:  Credential) : Promise<Response> => {
    const response = await serverRequest("post", "auth/login", data, "json");
    return response;
}

export const getUserData = async () : Promise<User | undefined> => {
    const response : Response = await serverRequest("get", "auth/data");
    const user : User = response.data;
    if(user){
      return user;
    }
}

export const googleAuth = () =>  {}

export const fbAuth = () => {}

export const appleAuth = () => {}

export const logout = () => {
    
}

export const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassWord = (password: string): boolean => {
    
    const isLongEnough = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
  
    return isLongEnough && hasUppercase && hasLowercase && hasNumber;
}
  

  