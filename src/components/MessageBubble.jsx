export default function MessageBubble({ message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 items-end ${isUser ? "flex-row-reverse" : ""}`}>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-2xl flex items-center justify-center text-sm flex-shrink-0"
        style={{
          background: isUser
            ? "linear-gradient(135deg, #2d2d2d, #1a1a1a)"
            : "rgba(255,255,255,0.8)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
        {isUser ? "👤" : "🤖"}
      </div>

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* Bubble */}
        <div className="max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed"
          style={{
            background: isUser
              ? "linear-gradient(135deg, #2d2d2d, #1a1a1a)"
              : "rgba(255,255,255,0.75)",
            color: isUser ? "white" : "#2d2d2d",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            borderBottomRightRadius: isUser ? "4px" : "16px",
            borderBottomLeftRadius: isUser ? "16px" : "4px",
            backdropFilter: "blur(10px)"
          }}>
          {message.text}
        </div>

        {/* Time */}
        {message.time && (
          <span className="text-xs mt-1 px-1" style={{ color: "#8a7a75" }}>
            {message.time}
          </span>
        )}
      </div>
    </div>
  )
}