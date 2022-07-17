import styles from "../styles/createGig.module.css";
import { GigForm } from "../components/gigForm";

export default function createGig() {
  return (
    <section className={styles.createGig}>
      <h1>DESCRIBE YOUR GIG</h1>
      <section className={styles.createGigContainer}>
        <GigForm />
      </section>
    </section>
  );
}
