import React, { useState } from 'react'
import "./css/chat_widget.css";
import { HiDotsVertical } from 'react-icons/hi';
import { FaChevronDown, FaRegFaceSmile, FaXmark } from 'react-icons/fa6';
import { LuBellRing, LuPaperclip } from 'react-icons/lu';
import { MdCancel } from 'react-icons/md';
import { PiPaperPlaneRightFill } from 'react-icons/pi';
import { useGlobalProvider } from '@/constants/provider';
import { Message, MessageResult } from '@/constants/types';
import { defaultUserDp, formatChatTime } from '@/constants';

interface Prop {
    setOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
    openChat: boolean;
}

const ChatWidget:React.FC<Prop> = ({ openChat, setOpenChat }) :React.JSX.Element => {

    const { messages, user } = useGlobalProvider();
    const setNotif = () => {};
    const [openOptions, setOpenOptions] = useState<boolean>(false);

    const toggleEmoji = () => {

    }
    const previewFile = () => {
        
    }

  return (
    <div className={`alquify_chat_widget_container_ss2d1-tup5-5de0-00ef ${openChat && "open_chat"}`}>
        <div className="alquify_chat_widget_header_ss2d1-tup5-5de0-00ef">
            <div className="alquify_chat_widget_header_left_ss2d1-tup5-5de0-00ef">
                <img src="/ShopAm-logo/default.png" id="alquify_chat_widget_user_dp_ss2d1-tup5-5de0-00ef" alt="" /> 
            </div>

            <div className="alquify_chat_widget_header_center_ss2d1-tup5-5de0-00ef">
                <div className="alquify_chat_widget_header_center_up_ss2d1-tup5-5de0-00ef">How may we help?</div>
                <div className="alquify_chat_widget_header_center_down_ss2d1-tup5-5de0-00ef">
                    <div className="alquify_chat_widget_header_center_down_status_ss2d1-tup5-5de0-00ef"></div>
                    <div className="alquify_chat_widget_header_center_down_name_ss2d1-tup5-5de0-00ef">Average Response Time Frame</div>
                </div>
            </div>

            <div className="alquify_chat_widget_header_right_ss2d1-tup5-5de0-00ef">
                <HiDotsVertical name='dots-vertical-rounded' onClick={() => setOpenOptions(true)} />
                <FaChevronDown name='chevron-down' onClick={() => setOpenChat(false)} />
            </div>
        </div>


        <div className="alquify_chat_widget_main_ss2d1-tup5-5de0-00ef">
          {messages.map((msg:MessageResult) => {
            const data = JSON.parse(msg.data) as Message;
     
            if(data.sender.id === user.user_id){ //sent by user
              if((data.attachments||[]).length > 0 && data.content.length > 0){ //file and message

                return(
                  <div key={msg.id} className="chat_widget_main_message_container">
                    <div className="chat_widget_main_message_right">
                        <div className="chat_widget_main_response_right_file_container" style={{color: "var(--color)"}}>
                            <span className="chat_widget_main_response_right_filename">{(data.attachments||[])[0].type.toUpperCase()}</span>
                            <span className="chat_widget_main_message_right_file_extension" data-url="${ServerfileDir}/${msg.file}" style={{backgroundColor: "var(--accent)"}}>{"JPG"}</span>
                        </div>
                        <span className="chat_widget_main_response_right_message" style={{color: "var(--color)"}}>{data.content}</span>
                        <span className="chat_widget_main_response_right_time" style={{color: "var(--color)"}}>{formatChatTime(data.timestamp)}</span>
                    </div>

                    <div className="chat_widget_main_date_time">{formatChatTime(data.timestamp)}</div>
                </div>
                )
              

              }else if((data.attachments||[]).length > 0){ // only file

                return(
                  <div key={msg.id} className="chat_widget_main_message_container">
                    <div className="chat_widget_main_message_right">
                        <div className="chat_widget_main_response_right_file_container" style={{color: "var(--color)"}}>
                            <span className="chat_widget_main_response_right_filename">{(data.attachments||[])[0].type.toUpperCase()}</span>
                            <span className="chat_widget_main_message_right_file_extension" data-url="${ServerfileDir}/${msg.file}" style={{backgroundColor: "var(--accent)"}}>{"JPG"}</span>
                        </div>
                        <span className="chat_widget_main_response_right_time" style={{color: "var(--color)"}}>{formatChatTime(data.timestamp)}</span>
                    </div>

                    <div className="chat_widget_main_date_time">{formatChatTime(data.timestamp)}</div>
                </div>
                )
                
              }else{ //only message
                return (
                  <div key={msg.id} className="chat_widget_main_message_container">
                    <div className="chat_widget_main_message_right">
                        <span className="chat_widget_main_response_right_message" style={{color: "var(--color)"}}>{data.content}</span>
                        <span className="chat_widget_main_response_right_time" style={{color: "var(--color)"}}>{formatChatTime(data.timestamp)}</span>
                    </div>

                    <div className="chat_widget_main_date_time">{formatChatTime(data.timestamp)}</div>
                 </div>
                )
              }

            }else{ //sent by recipient

              if((data.attachments||[]).length > 0 && data.content.length > 0){ //file and message

                return (
                <div key={msg.id} className="chat_widget_main_response_container">
                  <div className="chat_widget_main_response_left">
                      <img src={defaultUserDp} id="chat_widget_response_dp" />
                  </div>
                  <div className="chat_widget_main_response_right">
                  <span className="chat_widget_main_response_right_message">{data.content}</span>
                      <div className="chat_widget_main_response_right_file_container">
                          <span className="chat_widget_main_response_right_filename">{(data.attachments||[])[0].type.toUpperCase()}</span>
                          <span className="chat_widget_main_response_right_file_extension" data-url="${ServerfileDir}/${msg.file}" style={{color: "var(--accent)"}} >{(data.attachments||[])[0].url.split(".")?.pop()?.toLowerCase()}</span>
                      </div>

                      <span className="chat_widget_main_response_right_time">{formatChatTime(data.timestamp)}</span>
                  </div>
                  
                  <div className="chat_widget_main_date_time">{formatChatTime(data.timestamp)}</div>
                </div>
                )

              }else if((data.attachments||[]).length > 0){ // only file

                return (
                  <div key={msg.id} className="chat_widget_main_response_container">
                    <div className="chat_widget_main_response_left">
                        <img src={defaultUserDp} id="chat_widget_response_dp" />
                    </div>
                    <div className="chat_widget_main_response_right">
                        <div className="chat_widget_main_response_right_file_container">
                            <span className="chat_widget_main_response_right_filename">{(data.attachments||[])[0].type.toUpperCase()}</span>
                            <span className="chat_widget_main_response_right_file_extension" data-url="${ServerfileDir}/${msg.file}" style={{color: "var(--accent)"}} >{(data.attachments||[])[0].url.split(".")?.pop()?.toLowerCase()}</span>
                        </div>
  
                        <span className="chat_widget_main_response_right_time">{formatChatTime(data.timestamp)}</span>
                    </div>
                    
                    <div className="chat_widget_main_date_time">{formatChatTime(data.timestamp)}</div>
                  </div>
                  )

              }else{ //only message
                return (
                  <div key={msg.id} className="chat_widget_main_response_container">
                    <div className="chat_widget_main_response_left">
                        <img src={defaultUserDp} id="chat_widget_response_dp" />
                    </div>
                    <div className="chat_widget_main_response_right">
                       <span className="chat_widget_main_response_right_message">{data.content}</span>
                        <span className="chat_widget_main_response_right_time">{formatChatTime(data.timestamp)}</span>
                    </div>
                    
                    <div className="chat_widget_main_date_time">{formatChatTime(data.timestamp)}</div>
                  </div>
                  )
              }

            }
            
          })}
        </div>


        <div className="alquify_chat_widget_emoji_container_ss2d1-tup5-5de0-00ef"></div>

        <div className={`alquify_chat_widget_options_container_ss2d1-tup5-5de0-00ef ${openOptions && "open_option"}`}>
          <div className={`alquify_chat_widget_options ${openOptions && "open_option"}`}>
            <div className="alquify_chat_widget_options_header">
                <span className="alquify_chat_widget_options_header_text">Settings</span>
                <FaXmark size={20} color="#838383" onClick={() => setOpenOptions(false)} className="alquify_chat_widget_options_header_x" />
            </div>

            <div className="alquify_chat_widget_options_body">
              <div className="alquify_chat_widget_option">
                <LuBellRing size={15} color="var(--accent-color)" />
                <span className="alquify_chat_widget_option_label">Notification sound</span>
                <div className="alquify_chat_widget_option_switch_control_container">
                   <label className="alquify_switch">
                      <input type="checkbox" id="alquify_checkbox" onChange={setNotif} checked />
                      <span className="alquify_slider alquify_round"></span>
                    </label>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="alquify_chat_widget_filePreview_container_ss2d1-tup5-5de0-00ef" ></div>
        <MdCancel color="var(--text-fade)" className="close_alquify_preview" />

        <div className="alquify_chat_widget_footer_ss2d1-tup5-5de0-00ef">
            <form onSubmit={undefined} encType="multipart/form-data" id="alquify_message_form" className="alquify_chat_widget_footer_input_controls_ss2d1-tup5-5de0-00ef">
                <div className="alquify_chat_widget_footer_input_emoji_ss2d1-tup5-5de0-00ef">
                   
                    <textarea placeholder='Type a message' data-name="alquify_chat_widget_input" className="alquify_chat_widget_footer_input"></textarea>
                    <FaRegFaceSmile name='smile' color="#9b9b9b" className="alquify_chat_widget_footer_smile_emoji" onClick={toggleEmoji} />
                </div>
                <div className="alquify_chat_widget_footer_input_file_send_ss2d1-tup5-5de0-00ef">
                    <LuPaperclip className="box-icon-paperclip" size={15} color="#9b9b9b" />
                    <input type="file" name="file" onChange={previewFile} id="alquify_chat_file" accept="application/*, text/*, image/*" />
                      <button className="box-icon-send" type="submit">
                        <PiPaperPlaneRightFill className='send-icon' size={20} color="var(--accent-color)" />
                      </button>
                </div>
            </form>
            <a className="alquify_chat_widget_footer_powered_text_ss2d1-tup5-5de0-00ef" href="">Powered by Alquify</a>
        </div>



    </div>
  )
}

export default ChatWidget