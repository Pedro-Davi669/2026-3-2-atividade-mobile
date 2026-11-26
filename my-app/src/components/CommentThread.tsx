import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';
import { getAvatarColors, getInitials, relativeTime } from '@/lib/format';
import type { HydratedComment } from '@/types/diatinf';

type Props = {
  comments: HydratedComment[];
  onReply: (parentId: string, content: string) => void;
  onRemove: (commentId: string) => void;
  depth?: number;
};

export function CommentThread({ comments, onReply, onRemove, depth = 0 }: Props) {
  const router = useRouter();
  const { currentUser } = useDiatinf();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const submitReply = (parentId: string) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (!replyText.trim()) return;
    onReply(parentId, replyText);
    setReplyText('');
    setReplyingTo(null);
  };

  return (
    <View style={[styles.list, depth > 0 && styles.nestedList]}>
      {comments.map((comment) => {
        const avatarColor = getAvatarColors(comment.author.username);
        const isOwner = currentUser?.id === comment.author.id;
        const isReplying = replyingTo === comment.id;

        return (
          <View key={comment.id} style={styles.itemWrap}>
            <View style={styles.commentCard}>
              <View style={styles.topRow}>
                <Pressable
                  style={styles.authorRow}
                  onPress={() =>
                    router.push({
                      pathname: '/profile/[username]',
                      params: { username: comment.author.username },
                    })
                  }>
                  <View style={[styles.avatar, { backgroundColor: avatarColor.bg }]}>
                    <Text style={[styles.avatarText, { color: avatarColor.text }]}>
                      {getInitials(comment.author.name)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.authorName}>{comment.author.name}</Text>
                    <Text style={styles.authorMeta}>
                      @{comment.author.username} · {relativeTime(comment.createdAt)}
                    </Text>
                  </View>
                </Pressable>

                {isOwner && (
                  <Pressable onPress={() => onRemove(comment.id)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={14} color={DiatinfColors.danger} />
                  </Pressable>
                )}
              </View>

              <Text style={styles.content}>{comment.content}</Text>

              <Pressable
                style={styles.replyTrigger}
                onPress={() => setReplyingTo((prev) => (prev === comment.id ? null : comment.id))}>
                <Ionicons name="return-down-forward" size={14} color={DiatinfColors.orangeDark} />
                <Text style={styles.replyTriggerText}>Responder</Text>
              </Pressable>

              {isReplying && (
                <View style={styles.replyBox}>
                  <TextInput
                    value={replyText}
                    onChangeText={setReplyText}
                    placeholder={`Responder a @${comment.author.username}...`}
                    placeholderTextColor={DiatinfColors.textMuted}
                    style={styles.replyInput}
                    autoFocus
                  />
                  <Pressable style={styles.sendBtn} onPress={() => submitReply(comment.id)}>
                    <Text style={styles.sendBtnText}>Enviar</Text>
                  </Pressable>
                </View>
              )}
            </View>

            {comment.replies.length > 0 && (
              <CommentThread
                comments={comment.replies}
                onReply={onReply}
                onRemove={onRemove}
                depth={depth + 1}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  nestedList: {
    marginLeft: 16,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: DiatinfColors.orange,
  },
  itemWrap: {
    gap: 8,
  },
  commentCard: {
    backgroundColor: DiatinfColors.creamSoft,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '800',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  authorMeta: {
    fontSize: 11,
    color: DiatinfColors.textMuted,
  },
  deleteBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: DiatinfColors.dangerBg,
  },
  content: {
    fontSize: 14,
    lineHeight: 19,
    color: DiatinfColors.text,
  },
  replyTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  replyTriggerText: {
    fontSize: 12,
    fontWeight: '700',
    color: DiatinfColors.orangeDark,
  },
  replyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  replyInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: DiatinfColors.navy,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
  },
  sendBtn: {
    backgroundColor: DiatinfColors.navy,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
