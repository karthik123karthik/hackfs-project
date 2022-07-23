import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navbar() {
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
        <li>
        <ConnectButton    showBalance={false}/>
        </li>
        <li>
          <a>Sign In</a>
        </li>
      </ul>
    </nav>
  );
}
