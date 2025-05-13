import { AuthContext } from '@/layouts/authLayout';
import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router'
import "./css/auth.css";
import { HiEnvelope } from 'react-icons/hi2';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { MdLock } from 'react-icons/md';
import ActivityIndicator from '@/components/activity_indicator';
import { useGlobalProvider } from '@/constants/provider';
import { isEmailValid, isValidPassWord, registerUser } from '@/constants/auth';

const SignUp : React.FC = () : React.JSX.Element => {

  const navigate = useNavigate();
  const { setMeta } = useOutletContext<AuthContext>();
  const { setNote } = useGlobalProvider();
  useEffect(() => setMeta({text: "Create new account", switchText: "Already have an account?", switchLinkText: "Signin", switchLink: "/auth/signin"}), []);
  interface Form {
    email: string;
    password: string;
    remember: boolean;
  }
  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
    remember: false
  });
  const [show, setShow] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


  const submit = async () => {
    if (!isEmailValid(form.email)) {
      setNote({type: "error", title: "Error", body: "Please enter a valid email"})
      setIsSubmitting(false);
      return setTimeout(()=>setNote(undefined),2000);
    }
    if (!isValidPassWord(form.password)){
      setNote({type: "error", title: "Error", body: "Password must contain Uppercase, lowercase, number, and atleast 6 digit"})
      setIsSubmitting(false);
      return setTimeout(()=>setNote(undefined),5000);
    }
    const response  = await registerUser(form);
    if(response.message !==  "success"){
      setNote({type: "error", title: "Error", body: response.message})
      setIsSubmitting(false);
      return setTimeout(()=>setNote(undefined),2000);
    }
    
    setNote({type: "success", title: "Success", body: "Log in successful"});
    setIsSubmitting(false);
    navigate("/");
    return setTimeout(()=>setNote(undefined),2000);

  };


  const handleSubmit = () => {
     setIsSubmitting(true);
     setTimeout(submit, 1500);
  }


  return (
    <div className='auth_container'>
      <div className="auth_input_box_container">
        <div className="auth_input_box_icon_container">
          <HiEnvelope size={20} />
        </div>
        <input type="email" value={form.email} onChange={(e) => {
          const value = e.target.value;
          setForm((prev) => ({...prev, email: value}))
        }} name="" className="auth_input" placeholder='Enter your email' />
      </div>
      <div className="auth_input_box_container">
        <div className="auth_input_box_icon_container">
          <MdLock size={20} />
        </div>
        <input type={show ? "text" : "password"} value={form.password} onChange={(e) => {
          const value = e.target.value;
          setForm((prev) => ({...prev, password: value}))
        }} name="" className="auth_input" placeholder='Enter your password' />
        <div onClick={() => setShow(!show)} className="auth_input_show_hide">
          {show && <AiFillEye size={20} />}
          {!show && <AiFillEyeInvisible size={20} />}
        </div>
      </div>

      <div className='auth_remember_forgot'>
        <div className="auth_remember_container">
          <input type="checkbox" name="" className="auth_check_box" />
          <span className='auth_remember_text'>Remember me</span>
        </div>

        {/*<span className="auth_forgot">Forgot password</span>*/}
      </div>

      <div className="auth_submit_container">
        <button onClick={handleSubmit} className='auth_submit_button'>
          {!isSubmitting && "Sign up"}
          {isSubmitting && (
            <div className='activity_indicator_wrapper'>
            <ActivityIndicator size='small' />
           </div>)}
        </button>
      </div>
    </div>
  )
}

export default SignUp