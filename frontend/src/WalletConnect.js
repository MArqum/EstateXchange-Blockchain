import React, { useEffect, useContext } from "react";
import ConnectionContext from "./context/ConnectionContext";
import { ethers } from "ethers";
import "./WalletConnect.css";

const WalletConnect = () => {
  const { setUserInfo, setSigner, userInfo, isConnected, setIsConnected } =
    useContext(ConnectionContext);

  /************************************** onRefresh disconnect the Network **********************/

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        onDisconnect();
      });
      window.ethereum.on("accountsChanged", () => {
        onDisconnect();
        // onConnect();
      });
    }

    async function checkConnectedWallet() {
      const userData = JSON.parse(localStorage.getItem("userAccount"));
      if (userData && "SepoliaTestnet" === userData.networkName) {
        await onConnect();
      } else {
        await switchNetwork();
        // await onConnect();
      }
    }

    checkConnectedWallet();
  }, []);

  /************************************** detecting current provider ****************************/

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    return provider;
  };

  /**************************************** Switching to Selected Network ***********************/

  const addNetwork = async () => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networksConfig["SepoliaTestnet"],
          },
        ],
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  /******************************************** Supported Networks ******************************/

  const networksConfig = {
    SepoliaTestnet: {
      chainId: `0x${Number(11155111).toString(16)}`,
      rpcUrls: ["https://sepolia.infura.io/v3/055d21a8d04b4824a51cee693024b8e8"],
      chainName: "Sepolia Testnet",
      nativeCurrency: {
        name: "SepoliaETH",
        symbol: "SepoliaETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://sepolia.etherscan.io"],
    },
  };

  /************************************ Formating Connected Wallet Address **********************/

  const convertAddress = async (account) => {
    // WallatAddress length 42
    const addressmystring =
      account.slice(0, 6) + "..." + account.slice(38, account.length);
    return addressmystring;
  };

  /**************************************** Connecting to Metamask ******************************/

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();

      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log("MetaMask not installed, using read-only defaults");
        }
        let provider = new ethers.BrowserProvider(currentProvider);
        console.log(provider);
        let { name, chainId } = await provider.getNetwork();
        chainId = Number(chainId);
        console.log(
          chainId,
          name,
          networksConfig["SepoliaTestnet"].chainId,
          `0x${Number(chainId).toString(16)}`
        );

        if (
          `0x${Number(chainId).toString(16)}` ===
          networksConfig["SepoliaTestnet"].chainId
        ) {
          console.log("Bravo!, you are on the correct network");
          let signer = await provider.getSigner();

          const userData = JSON.parse(localStorage.getItem("userAccount"));
          if (userData) {
            setUserInfo(userData);
            setSigner(signer);
            setIsConnected(true);
          } else {
            // const signMessage = "You're here to claim your reward!";
            // const signature = await signer.signMessage(signMessage);
            // console.log(signature);

            let account = await provider.send("eth_requestAccounts", []);
            let ethBalance = await provider.getBalance(account[0]);
            ethBalance = ethers.formatEther(ethBalance);

            const shortAddress = await convertAddress(account[0]);
            saveUserInfo(
              account[0],
              parseInt(chainId),
              ethBalance,
              shortAddress,
              signer,
            //   signature
            );
            console.log(
              account[0],
              parseInt(chainId),
              ethBalance,
              shortAddress,
              signer,
            //   signature
            );
          }
        } else {
          await switchNetwork();
        }
      }
    } catch (err) {
      console.log(
        "There was an error fetching your accounts. Make sure your Ethereum client is configured correctly."
      );
      console.log(err);
    }
  };

  /**************************************** Switching Network ***********************************/

  const switchNetwork = async () => {
    console.log(
      "Switch chainId : ",
      `${networksConfig["SepoliaTestnet"].chainId}`,
      "switch networkName :  SepoliaTestnet"
    );
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `${networksConfig["SepoliaTestnet"].chainId}` }],
      });
      console.log(`Successfully switched to chain with ID ${"SepoliaTestnet"}`);
    } catch (switchError) {
      if (switchError.code === 4001) {
        console.log("User rejected the chain switching request");
      } else if (switchError.message.includes("already pending")) {
        console.log(
          "A chain switching request is already pending, please wait"
        );
      } else if (switchError.code === 5902) {
        console.log(
          "This network is not available in your metamask, please add it"
        );
        try {
          await addNetwork();
        } catch (error) {
          console.log("Failed to switch to the network");
          console.log(error);
        }
      } else {
        console.error(switchError);
      }
    }
    console.log("oulalal, switch to the correct network");
  };

  /**************************************** Disconnecting to Metamask ***************************/

  const onDisconnect = () => {
    window.localStorage.removeItem("userAccount");
    window.localStorage.removeItem("etherObj");
    setSigner({});
    setUserInfo({});
    setIsConnected(false);
    console.log("You are dissconnected !!");
  };

  /********************************* Saving Connected User Wallet address ***********************/

  const saveUserInfo = (
    account,
    chainId,
    ethBalance,
    shortAddress,
    etherObj,
    signature
  ) => {
    console.log("Saving User Info");

    const userAccount = {
      account: account,
      chainId: chainId,
      balance: ethBalance,
      shortaddress: shortAddress,
      networkName: "SepoliaTestnet",
    //   signature: signature,
    };
    window.localStorage.setItem("userAccount", JSON.stringify(userAccount)); //user persisted data
    const userData = JSON.parse(localStorage.getItem("userAccount"));
    setUserInfo(userData);
    setSigner(etherObj);
    setIsConnected(true);
  };
  return (
    <div className="connect-container">
      {isConnected ? (
        <button onClick={onDisconnect}>
          <span>{userInfo.shortaddress}</span>
        </button>
      ) : (
        <button onClick={onConnect} style={{fontSize:'13px'}}>Connect Wallet</button>
      )}
    </div>
  );
};

export default WalletConnect;
