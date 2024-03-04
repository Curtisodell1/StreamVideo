import { useEffect, useState } from "react"
import {Call, CallControls, StreamCall, StreamTheme, StreamVideo, SpeakerLayout, StreamVideoClient} from "@stream-io/video-react-sdk";
import { StreamChat } from 'stream-chat'
import "@stream-io/video-react-sdk/dist/css/styles.css"
import "./index.css"

const callId = "d4Ikz42U6tDX"
const user_id = "Nom_Anor"
const user = {
  id: user_id,
  name: "Curtis",
  image: "https://picsum.photos/200"
}
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiTm9tX0Fub3IiLCJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL05vbV9Bbm9yIiwiaWF0IjoxNzA4ODAyMjgxLCJleHAiOjE3MDk0MDcwODZ9.e_aEPGfcoH38B8JVPrqwxM7puwDpkMTxqNQs39Iej6E"

const apiKey = "mmhfdzb5evj2";

const chatClient = new StreamChat(apiKey)
chatClient.connectUser(
  {
    id: user_id,
    name: 'Curtis',
  },
  token,
)

const channel = chatClient.channel("messaging",
  {
    id: 4,
    name: "My streaming channel",
    members: ['cj', 'curtis'],
  }
)

export default function App() {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();

  useEffect(() => {
    const myClient = new StreamVideoClient({ apiKey, user, token });
    setVideoClient(myClient);
    return () => {
      myClient.disconnectUser();
      setVideoClient(undefined);
    };
  }, []);

  useEffect(() => {
    if (!videoClient) return;
    const myCall = videoClient.call("default", callId);
    myCall.join({ create: true }).catch((err) => {
      console.error(`Failed to join the call`, err);
    });

    setCall(myCall);

    return () => {
      setCall(undefined);
      myCall.leave().catch((err) => {
        console.error(`Failed to leave the call`, err);
      });
    };
  }, [videoClient]);

  if (!videoClient || !call) return null;
  // if (!chatClient || !channel) return null;

  return (
    <div id="bigbox">
      <div id="leftSide">
        <div id="streamHeader">
          <h1>Welcome to my stream</h1>
        </div>
        <div id="vidbox">
            <StreamVideo client={videoClient}>
              <StreamTheme className="my-theme-overrides">
                <StreamCall call={call}>
                  <SpeakerLayout />
                  <CallControls />
                </StreamCall>
              </StreamTheme>
            </StreamVideo>
        </div>
      </div>
      <div id="chatbox">
      <Chat client={chatClient}>
        <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
      </Chat>
      </div>
    </div>
  );
}
