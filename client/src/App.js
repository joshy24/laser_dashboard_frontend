import logo from './logo.svg';
import './App.css'; 

import Dashboard from "./NewApp"

import PubNub from 'pubnub'
import { PubNubProvider, usePubNub } from 'pubnub-react'

const pubnub = new PubNub({
  publishKey: 'pub-c-100b3918-0e25-4fac-ade6-c58d013cd019',
  subscribeKey: 'sub-c-21e1e450-9457-11e9-bf84-1623aee89087',
  uuid: "lllaser"
});

function App() {
  return (
      <PubNubProvider client={pubnub}>
          <Dashboard />
      </PubNubProvider>
  );
}

export default App;
