import styles from "../styles/createGig.module.css";

export function GitForm() {
  return (
    <form
      className={styles.createGigForm}
      name="create-gig-form"
      method="POST"
      action="#"
    >
      <label className={styles.label} htmlFor="describe">
        Describe the job you need help with? - Please describe it in detail
      </label>
      <textarea
        className={styles.gigForm__inputs}
        id="describe"
        name="describe"
        type="text"
        style={{ width: 650, height: 200 }}
        required
      ></textarea>
      <label className={styles.label} htmlFor="category">
        Choose a category:
      </label>
      <select
        className={styles.gigForm__inputs}
        id="category"
        name="category"
        style={{ width: 200, height: 35 }}
        required
      >
        <option value="smartcontract">Smart Contract</option>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="logo">Logo</option>
      </select>
      <label className={styles.label} htmlFor="deadline">
        When is the deadline? - From once you place your order
      </label>
      <input
        className={styles.gigForm__inputs}
        id="deadline"
        name="deadline"
        type="date"
        style={{ width: 200, height: 35 }}
        required
      />
      <label className={styles.label} htmlFor="budget">
        What is your budget for this job?
      </label>
      <input
        className={styles.gigForm__inputs}
        id="budget"
        name="budget"
        style={{ width: 200, height: 35 }}
        required
      />
      <button className={styles.gigForm__btn} type="submit">
        Submit
      </button>
    </form>
  );
}
