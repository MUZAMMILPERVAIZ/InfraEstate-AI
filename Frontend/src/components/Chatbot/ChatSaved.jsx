const ChatSaved = ({ messagetitle, message, time }) => {
  return (
    <div className="w-full py-3 hover:bg-[#e7ecf8] hover:border-r-4 hover:border-[#007aff]">
      <div className="px-4 flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-md">{messagetitle}</p>
          <p className="text-sm text-[rgb(97,97,102)]">{message}</p>
        </div>
        <p className="text-sm text-[#616166]">{time}</p>
      </div>
    </div>
  );
};

export default ChatSaved;
