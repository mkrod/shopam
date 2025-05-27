import React, { useEffect, useState } from 'react'
import "./css/mobile_me.css";
import { HiEnvelope } from 'react-icons/hi2';
import { FaAddressBook, FaLocationDot, FaPhone, FaUser } from 'react-icons/fa6';
import ActivityIndicator from '@/components/activity_indicator';
import { useGlobalProvider } from '@/constants/provider';
import { serverRequest } from '@/constants';
import { Response } from '@/constants/api';
import { isEmailValid } from '@/constants/auth';

const MobileMe : React.FC = () : React.JSX.Element => {
    interface Form {
        email?:  string;
        name?: {
            first: string;
            last: string;
        }
        address?: string;
        contact?: string;
    } 
    
    const { user, setNote, setUserChanged } = useGlobalProvider();
    const [form, setForm] = useState<Form>({email: "", name: {first: "", last: ""}, address: "", contact: ""});
    const  [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            email: user.email,
            name: {
                first: user.user_data?.name?.first || "",
                last: user.user_data?.name?.last || ""
            },
            address: user.user_data?.address || "",
            contact: user.user_data?.contact || ""
        }));
    }, [user]);


    const handleSubmit = () => {
        if(!isEmailValid(form.email || "")){
            return setNote({type: "error", title: "failed", body: "Invalid email"})
        }
        setIsSubmitting(true);

        const submit = async () => {
            const response : Response = await serverRequest("post", "user/edit/", form, "json");
            if(response.message === "success"){
                setIsSubmitting(false);
                setUserChanged(true);
                setNote({type: "success", title: "Updated", body: "Profile updated"});
                setTimeout(() => setNote(undefined),2000);
            }

        }

        setTimeout(submit, 2000);
    }

    const getLocation = () => {}

  return (
    <div className='mobile_me_container'>



        <div className="mobile_me_form_container">
            <h2 className='mobile_me_form_hd_text'>Manage your account</h2>

            <div className="auth_input_box_container">
                <div className="auth_input_box_icon_container">
                    <FaUser size={20} />
                </div>
                <input type="text" value={form.name?.first} onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({...prev, name: {...prev.name, first: value, last: prev.name?.last || ""}}))
                    }}   name="first_name" className="auth_input" placeholder='First Name' />
            </div>
            <div className="auth_input_box_container">
                <div className="auth_input_box_icon_container">
                    <FaUser size={20} />
                </div>
                <input type="text" value={form.name?.last} onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({...prev, name: {...prev.name, first: prev.name?.first || "", last: value}}))
                    }} name="last_name" className="auth_input" placeholder='Last Name' />
            </div>
            <div className="auth_input_box_container">
                <div className="auth_input_box_icon_container">
                    <HiEnvelope size={20} />
                </div>
                <input readOnly type="email" value={form.email} onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({...prev, email: value}))
                    }} name="email" className="auth_input" placeholder='Enter your email' />
            </div>
            <div className="auth_input_box_container">
                <div className="auth_input_box_icon_container">
                    <FaAddressBook size={20} />
                </div>
                <input type="text" value={form.address} onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({...prev, address: value}))
                    }} name="" className="auth_input" placeholder='Delivery Address' />
                <div onClick={getLocation} className="auth_input_show_hide">
                    <FaLocationDot  />
                </div>
            </div>
            <div className="auth_input_box_container">
                <div className="auth_input_box_icon_container">
                    <FaPhone size={20} />
                </div>
                <input type="tel" value={form.contact} onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({...prev, contact: value}))
                    }} name="" className="auth_input" placeholder='Contact Phone' />
            </div>

            <div className="auth_submit_container">
                <button onClick={handleSubmit} className='auth_submit_button'>
                    {!isSubmitting && "Update"}
                    {isSubmitting && (
                    <div className='activity_indicator_wrapper'>
                    <ActivityIndicator size='small' />
                    </div>)}
                </button>
            </div>
        </div>
    </div>
  )
}

export default MobileMe