import { useState, useRef, useEffect } from "react";
import { providers } from "ethers";
import Web3Modal from "web3modal";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import styles from "../styles/Home.module.css";


export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [address, setAddress] = useState("");
  const web3Ref = useRef();

  useEffect(() => {
    if (!isWalletConnected) {
      web3Ref.current = new Web3Modal({
        network: "rinkeby",
        // cacheProvider: true,
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [isWalletConnected]);

  async function getProviderOrSigner(needSigner = false) {
    try {
      const provider = await web3Ref.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const userAddress = await web3Provider.getSigner().getAddress();
      setAddress(userAddress);
      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 4) {
        window.alert("please change the network to rinkeby");
        return;
      }
      if (needSigner) {
        return web3Provider.getSigner();
      }
      return web3Provider;
    } catch (error) {
      console.log(error);
    }
  }

  async function connectWallet() {
    try {
      const providerOrSigner = await getProviderOrSigner();
      if (providerOrSigner) {
        setIsWalletConnected(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
      <Navbar
        connectWallet={connectWallet}
        isWalletConnected={isWalletConnected}
        address={address}
      />
      <div className={styles.searchPart}>
        <h1 className="text-[3em] text-white ">
          find the perfect freelance service for your bussiness
        </h1>
        <div className="flex  justify-start items-center w-full">
          <div className="mb-3 xl:w-96">
            <div className="w-[75vw] input-group relative flex flex-wrap items-stretch mb-4 ">
              <input
                type="search"
                className="form-control relative flex-auto min-w-0 block h-12 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
              />
              <button
                className="btn inline-block px-10 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
                type="button"
                id="button-addon2"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="search"
                  className="w-4"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.popular}>
        <h2>Popular :</h2>
        <div className={styles.popularbtns}>
          <button className={styles.popularbtn}>Smart Contract</button>
          <button className={styles.popularbtn}>Frontend</button>
          <button className={styles.popularbtn}>Backend</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
