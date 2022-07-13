import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import { truncateAddress } from "../utils";

export function Navbar({ connectWallet, isWalletConnected, address }) {
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>dLance</h1>
      <ul className={styles.navItems}>
        <li>
          <a href="#">Explore</a>
        </li>
        <li>
          <Link href="/createGig">
            <a>Create Gig</a>
          </Link>
        </li>
        {!isWalletConnected ? (
          <li>
            <a onClick={connectWallet}>Connect Wallet</a>
          </li>
        ) : (
          <li label={address}>{truncateAddress(address)}</li>
        )}
        <li>
          <a>Sign In</a>
        </li>
      </ul>
    </nav>
  );
}
