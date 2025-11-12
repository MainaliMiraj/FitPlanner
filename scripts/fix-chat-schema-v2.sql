-- Add conversations table if it doesn't exist
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing conversation_id column to chat_messages if it doesn't exist
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS conversation_id UUID;

-- Add foreign key constraint for conversation_id if it doesn't exist
ALTER TABLE chat_messages
ADD CONSTRAINT IF NOT EXISTS fk_chat_messages_conversation_id
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

-- Enable RLS on conversations if not already enabled
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view messages from their conversations" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert messages to their conversations" ON chat_messages;

-- RLS policies for conversations
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for chat messages (already has user_id and messages policies)
CREATE POLICY "Users can view messages from their conversations" ON chat_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their conversations" ON chat_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );
