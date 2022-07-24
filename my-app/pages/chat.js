import styles from "../styles/chat.module.css";
import { ChatForm } from "../components/chatForm";

export default function chat() {
  return (
    <section className={styles.chat}>
      <section className={styles.chatContainer}>
        <p className={styles.messagingTo}>Messaging: Pannkakor</p>
        <ChatForm />
      </section>
    </section>
  );
}
