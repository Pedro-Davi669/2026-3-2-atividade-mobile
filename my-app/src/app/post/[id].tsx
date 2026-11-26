import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommentThread } from '@/components/CommentThread';
import { PostCard } from '@/components/PostCard';
import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';

export default function PostDetailScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentUser, getPostById, getCommentsForPost, addComment, deleteComment } = useDiatinf();
  const [commentText, setCommentText] = useState('');

  const post = getPostById(id);
  const comments = getCommentsForPost(id);

  const submitTopComment = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (!commentText.trim()) return;
    addComment(id, commentText, null);
    setCommentText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 10) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={DiatinfColors.gold} />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
        <Text style={styles.topTitle}>Publicação</Text>
        <View style={{ width: 64 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!post ? (
          <View style={styles.notFoundCard}>
            <Text style={styles.notFoundText}>Publicação não encontrada.</Text>
          </View>
        ) : (
          <>
            <PostCard post={post} showInlineComposer={false} />

            <View style={styles.commentsSection}>
              <View style={styles.commentsHeader}>
                <Ionicons name="chatbubbles" size={18} color={DiatinfColors.orangeDark} />
                <Text style={styles.commentsTitle}>
                  Comentários ({post.commentCount})
                </Text>
              </View>

              <View style={styles.newCommentBox}>
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder={
                    currentUser
                      ? 'Escreva seu comentário...'
                      : 'Entre na sua conta para comentar...'
                  }
                  placeholderTextColor={DiatinfColors.textMuted}
                  multiline
                  style={styles.commentInput}
                />
                <Pressable
                  onPress={submitTopComment}
                  style={({ pressed }) => [
                    styles.submitBtn,
                    !commentText.trim() && styles.submitBtnDisabled,
                    pressed && styles.pressed,
                  ]}>
                  <Ionicons name="send" size={14} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>Comentar</Text>
                </Pressable>
              </View>

              {comments.length === 0 ? (
                <Text style={styles.emptyComments}>
                  Ainda não há comentários. Seja o primeiro a responder!
                </Text>
              ) : (
                <CommentThread
                  comments={comments}
                  onReply={(parentId, text) => addComment(id, text, parentId)}
                  onRemove={(commentId) => deleteComment(commentId)}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DiatinfColors.cream,
  },
  topBar: {
    backgroundColor: DiatinfColors.navy,
    paddingHorizontal: 14,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: DiatinfColors.orange,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 64,
  },
  backText: {
    color: DiatinfColors.gold,
    fontSize: 14,
    fontWeight: '700',
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 14,
    gap: 14,
    paddingBottom: 32,
  },
  notFoundCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  notFoundText: {
    color: DiatinfColors.navy,
    fontWeight: '700',
  },
  commentsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
    gap: 12,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DiatinfColors.navy,
  },
  newCommentBox: {
    backgroundColor: DiatinfColors.surfaceMuted,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
    gap: 8,
  },
  commentInput: {
    minHeight: 44,
    fontSize: 14,
    color: DiatinfColors.navy,
    textAlignVertical: 'top',
  },
  submitBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: DiatinfColors.navy,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyComments: {
    textAlign: 'center',
    color: DiatinfColors.textMuted,
    fontSize: 13,
    paddingVertical: 12,
  },
  pressed: {
    opacity: 0.8,
  },
});
