import styles from "../styles/chat.module.css";

export function ChatForm() {
  return (
    <section className={styles.chatFormContainer}>
      <section className={styles.sentMessages}>
        {/* TODO: Implement so this container shows all the previous messages */}
      </section>
      <form className={styles.sendContainer}>
        <input className={styles.messageInput} />
        <button className={styles.messageSend__btn} type="submit">
          Send
        </button>
      </form>
    </section>
  );
}
