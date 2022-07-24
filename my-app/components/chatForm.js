import styles from "../styles/chat.module.css";
import { Client } from '@xmtp/xmtp-js'
import { useSigner } from "wagmi";
import { useState } from "react";

export function ChatForm() {

  const { data: signer } = useSigner();
  const xmtp = await Client.create(signer);

  const [message, setMessage] = useState("")

  const sendMessage = async () => {
    try {
      if (receiverAddress) {
        console.log(receiverAddress);
        if (ethers.utils.isAddress(receiverAddress)) {
          const conversation = await xmtp.conversations.newConversation(
            receiverAddress
          );
          console.log(conversation);
          if (message) {
            await conversation.send(message);
          }
        } else {
          console.log("not a valid address");
        }
      } else {
        console.log("receiver address is required");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={styles.chatFormContainer}>
      <section className={styles.sentMessages}>
        {/* TODO: Implement so this container shows all the previous messages */}
      </section>
      <form className={styles.sendContainer}>
        <input className={styles.messageInput} onChange={(e) => {setMessage(e.target.value)}} />
        <button className={styles.messageSend__btn} type="submit" onClick={sendMessage} >
          Send
        </button>
      </form>
    </section>
  );
}
