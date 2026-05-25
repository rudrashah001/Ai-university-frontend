import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/header'
import { ChatSidebar } from '@/components/chat-sidebar'
import { ChatInterface } from '@/components/chat-interface'
import { apiFetch } from '@/lib/api'
import { nanoid } from 'nanoid'

export default function HomePage() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatId, setChatId] = useState(() => nanoid())
  const [chatData, setChatData] = useState(null)
  const [loadingChat, setLoadingChat] = useState(false)

  const handleNewChat = useCallback(() => {
    setChatId(nanoid())
    setChatData(null)
    setSidebarOpen(false)
  }, [])

  const handleSelectChat = useCallback(
    async (selectedChatId) => {
      if (selectedChatId === chatId) {
        setSidebarOpen(false)
        return
      }

      setLoadingChat(true)
      setChatId(selectedChatId)

      try {
        const res = await apiFetch(`/api/chats/${selectedChatId}`)
        if (res.ok) {
          const data = await res.json()
          setChatData(data.chat)
        } else {
          setChatData(null)
        }
      } catch (error) {
        console.error('Failed to load chat:', error)
        setChatData(null)
      } finally {
        setLoadingChat(false)
        setSidebarOpen(false)
      }
    },
    [chatId]
  )

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-dvh flex-col">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        showMenuButton={!!user}
      />

      <div className="flex flex-1 overflow-hidden">
        {user && (
          <ChatSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            selectedChatId={chatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
          />
        )}

        <main className="flex-1 overflow-hidden">
          {loadingChat ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <ChatInterface
              key={chatId}
              chatId={chatId}
              initialMessages={chatData?.messages || []}
              onNewChat={handleNewChat}
            />
          )}
        </main>
      </div>
    </div>
  )
}
