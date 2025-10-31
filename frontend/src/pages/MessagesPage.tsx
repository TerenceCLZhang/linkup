import SideBar from "../components/messages/SideBar";
import ChatContainer from "../components/messages/ChatContainer";

const MessagesPage = () => {
  return (
    <div className="bg-secondary container flex justify-between rounded-lg h-[75vh] max-h-5xl w-full overflow-hidden mt-15">
      <SideBar />
      <ChatContainer />
    </div>
  );
};

export default MessagesPage;
