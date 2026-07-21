import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SectionTitle } from "@/components/ui";
import { CHAT_URL } from "@/lib/data";
import type { ChatMessage } from "@/lib/types";
import { colors, fonts } from "@/lib/theme";

const STARTERS = [
  "Who is the DM of Lucknow?",
  "How does the Union Council of Ministers connect to district administration?",
  "Which office handles water supply complaints?",
  "What data do we have on Karnataka district collectors?",
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }
      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.message?.content ?? "No response.",
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not reach AI agent."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={88}
    >
      <View style={styles.header}>
        <SectionTitle
          title="AI Agent"
          subtitle="Ask about India's government org chart — grounded in Accountable India."
        />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.thread}
        contentContainerStyle={styles.threadContent}
      >
        {messages.length === 0 ? (
          <View style={styles.starters}>
            <Text style={styles.starterHint}>Try one of these:</Text>
            {STARTERS.map((q) => (
              <Pressable
                key={q}
                onPress={() => send(q)}
                style={({ pressed }) => [
                  styles.starter,
                  pressed && { backgroundColor: colors.ink100 },
                ]}
              >
                <Text style={styles.starterText}>{q}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              msg.role === "user" ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                msg.role === "user" && { color: colors.white },
              ]}
            >
              {msg.content}
            </Text>
          </View>
        ))}

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.saffron500} />
            <Text style={styles.loadingText}>Thinking…</Text>
          </View>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask a question…"
          placeholderTextColor={colors.ink400}
          multiline
          editable={!loading}
        />
        <Pressable
          onPress={() => send(input)}
          disabled={loading || !input.trim()}
          style={[
            styles.send,
            (!input.trim() || loading) && { opacity: 0.4 },
          ]}
        >
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink50 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.ink200,
  },
  thread: { flex: 1 },
  threadContent: { padding: 16, gap: 10, paddingBottom: 24 },
  starters: { gap: 8, paddingVertical: 12 },
  starterHint: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink500,
    marginBottom: 4,
    textAlign: "center",
  },
  starter: {
    borderWidth: 1,
    borderColor: colors.ink200,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  starterText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink700,
    textAlign: "center",
  },
  bubble: {
    maxWidth: "92%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.ink950,
    borderTopRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.ink200,
    borderTopLeftRadius: 4,
  },
  bubbleText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink800,
    lineHeight: 21,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  loadingText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink500,
  },
  error: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.danger,
  },
  composer: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.ink200,
    backgroundColor: colors.white,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.ink200,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink900,
  },
  send: {
    backgroundColor: colors.ink950,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sendText: {
    fontFamily: fonts.sansSemi,
    fontSize: 14,
    color: colors.white,
  },
});
