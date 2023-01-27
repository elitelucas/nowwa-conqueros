import { useState, useEffect } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/app.sass";
import Page from "./components/Page";
import Home from "./screens/Home";
import UploadVariants from "./screens/UploadVariants";
import UploadDetails from "./screens/UploadDetails";
import ConnectWallet from "./screens/ConnectWallet";
import Faq from "./screens/Faq";
import Activity from "./screens/Activity";
import Search01 from "./screens/Search01";
import Mint from "./screens/Mint";
import Profile from "./screens/Profile";
import ProfileEdit from "./screens/ProfileEdit";
import Item from "./screens/Item";
import PageList from "./screens/PageList";
import NHome from "./screens/NHome";
import NAccount from "./screens/NAccount";
import Chat from "./screens/Chat";
import Gallery from "./screens/Gallery";
import Store from "./screens/Store";
import Game from "./screens/Game";
import Login from "./screens/Login";
import WalletBackup from "./screens/WalletBackup";
import Wallet from "./screens/Wallet";
import WalletSendToken from "./screens/Wallet/SendToken";
import WalletReceiveToken from "./screens/Wallet/ReceiveToken";
import ConquerContextProvider from "./contexts/ConquerContext";
import ChatContextProvider from "./contexts/ChatContext";
import WalletContextProvider from "./contexts/WalletContext";
import NFTContextProvider from "./contexts/NFTContext";

function App() {

  return (
    <ConquerContextProvider>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Page>
                <NHome />
              </Page>
            )}
          />
          <Route
            exact
            path="/profile"
            render={() => (
              <Page>
                <NAccount />
              </Page>
            )}
          />
          <Route
            exact
            path="/home"
            render={() => (
              <Page>
                <Home />
              </Page>
            )}
          />
          <Route
            exact
            path="/upload-variants"
            render={() => (
              <Page>
                <UploadVariants />
              </Page>
            )}
          />
          <Route
            exact
            path="/upload-details"
            render={() => (
              <Page>
                <UploadDetails />
              </Page>
            )}
          />
          <Route
            exact
            path="/connect-wallet"
            render={() => (
              <Page>
                <ConnectWallet />
              </Page>
            )}
          />
          <Route
            exact
            path="/faq"
            render={() => (
              <Page>
                <Faq />
              </Page>
            )}
          />
          <Route
            exact
            path="/activity"
            render={() => (
              <Page>
                <Activity />
              </Page>
            )}
          />
          <Route
            exact
            path="/search01"
            render={() => (
              <Page>
                <Search01 />
              </Page>
            )}
          />
          <Route
            exact
            path="/mint"
            render={() => (
              <NFTContextProvider>
                <WalletContextProvider>
                  <Page>
                    <Mint />
                  </Page>
                </WalletContextProvider>
              </NFTContextProvider>
            )}
          />
          <Route
            exact
            path="/gallery"
            render={() => (
              <NFTContextProvider>
                <Page>
                  <Gallery />
                </Page>
              </NFTContextProvider>
            )}
          />
          <Route
            exact
            path="/store"
            render={() => (
              <Page>
                <Store />
              </Page>
            )}
          />
          <Route
            exact
            path="/profile1"
            render={() => (
              <Page>
                <Profile />
              </Page>
            )}
          />
          <Route
            exact
            path="/profile-edit"
            render={() => (
              <Page>
                <ProfileEdit />
              </Page>
            )}
          />
          <Route
            exact
            path="/item"
            render={() => (
              <Page>
                <Item />
              </Page>
            )}
          />
          <Route
            exact
            path="/pagelist"
            render={() => (
              <Page>
                <PageList />
              </Page>
            )}
          />
          <Route
            exact path="/chat" render={() =>
              <ChatContextProvider>
                <Chat />
              </ChatContextProvider>
            } />
          <Route
            exact
            path="/game"
            render={() => (
              <Page>
                <Game />
              </Page>
            )}
          />
          <Route
            exact
            path="/login"
            render={() => (
              <Page>
                <Login />
              </Page>
            )}
          />
          <Route
            exact
            path="/wallet/backup"
            render={() => (
              <WalletContextProvider>
                <Page>
                  <WalletBackup />
                </Page>
              </WalletContextProvider>
            )}
          />
          <Route
            exact
            path="/wallet"
            render={() => (
              <WalletContextProvider>
                <Page>
                  <Wallet />
                </Page>
              </WalletContextProvider>
            )}
          />
          <Route
            exact
            path="/wallet/send"
            render={() => (
              <WalletContextProvider>
                <Page>
                  <WalletSendToken />
                </Page>
              </WalletContextProvider>
            )}
          />
          <Route
            exact
            path="/wallet/receive"
            render={() => (
              <WalletContextProvider>
                <Page>
                  <WalletReceiveToken />
                </Page>
              </WalletContextProvider>
            )}
          />
        </Switch>
      </Router>

    </ConquerContextProvider>

  );
}

export default App;
