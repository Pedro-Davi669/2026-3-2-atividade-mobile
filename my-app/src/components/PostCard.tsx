import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';
import { getAvatarColors, getInitials, relativeTime } from '@/lib/format';
import type { HydratedPost } from '@/types/diatinf';

import { StarRating } from './StarRating';

type Props = {
  post: HydratedPost;
  showInlineComposer?: boolean;
  onHashtagPress?: (tag: string) => void;
};

export function PostCard({ post, showInlineComposer = true, onHashtagPress }: Props) {
  const router = useRouter();
  const { currentUser, addComment, toggleLike, deletePost } = useDiatinf();
  const [quickComment, setQuickComment] = useState('');

  const avatarColors = getAvatarColors(post.author.username);
  const isOwner = currentUser?.id === post.author.id;
  const liked = currentUser ? post.likes.includes(currentUser.id) : false;

  const openPost = () => {
    router.push({ pathname: '/post/[id]', params: { id: post.id } });
  };

  const openProfile = (username: string) => {
    router.push({ pathname: '/profile/[username]', params: { username } });
  };

  const handleQuickComment = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (!quickComment.trim()) return;
    addComment(post.id, quickComment, null);
    setQuickComment('');
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return (
      <Text style={styles.bodyText}>
        {parts.map((part, idx) => {
          if (part.startsWith('#')) {
            return (
              <Text
                key={`${part}-${idx}`}
                style={styles.hashtag}
                onPress={() => {
                  if (onHashtagPress) {
                    onHashtagPress(part);
                  } else {
                    router.push({ pathname: '/(tabs)/explore', params: { q: part } });
                  }
                }}>
                {part}
              </Text>
            );
          }
          return part;
        })}
      </Text>
    );
  };

  return (
    <View style={styles.card}>
      {/* Post Header */}
      <View style={styles.headerRow}>
        <Pressable style={styles.authorRow} onPress={() => openProfile(post.author.username)}>
          <View style={[styles.avatar, { backgroundColor: avatarColors.bg }]}>
            <Text style={[styles.avatarText, { color: avatarColors.text }]}>
              {getInitials(post.author.name)}
            </Text>
          </View>
          <View style={styles.authorMeta}>
            <View style={styles.nameLine}>
              <Text style={styles.authorName} numberOfLines={1}>
                {post.author.name}
              </Text>
              {post.author.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeLabel}>{post.author.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.authorHandle}>@{post.author.username}</Text>
          </View>
        </Pressable>

        <View style={styles.rightHeader}>
          <Text style={styles.timeText}>{relativeTime(post.createdAt)}</Text>
          {isOwner && (
            <Pressable
              accessibilityLabel="Apagar publicação"
              onPress={() => deletePost(post.id)}
              style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={16} color={DiatinfColors.danger} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Post Content */}
      <Pressable onPress={openPost} style={styles.contentWrap}>
        {renderContent(post.content)}
      </Pressable>

      {/* Action Footer */}
      <View style={styles.actionsRow}>
        <View style={styles.leftActions}>
          <Pressable
            onPress={openPost}
            style={({ pressed }) => [styles.commentBtn, pressed && styles.pressed]}>
            <Ionicons name="chatbox-ellipses" size={15} color="#FFFFFF" />
            <Text style={styles.commentBtnText}>
              Comentar{post.commentCount > 0 ? ` (${post.commentCount})` : ''}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => (currentUser ? toggleLike(post.id) : router.push('/login'))}
            style={({ pressed }) => [
              styles.likeBtn,
              liked && styles.likeBtnActive,
              pressed && styles.pressed,
            ]}>
            <Ionicons
              name={liked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={15}
              color={liked ? DiatinfColors.orangeDark : DiatinfColors.textMuted}
            />
            <Text style={[styles.likeText, liked && styles.likeTextActive]}>
              {post.likes.length}
            </Text>
          </Pressable>
        </View>

        <StarRating postId={post.id} rating={post.rating} />
      </View>

      {/* Quick Inline Comment Composer (as in diatinf-x.jpg) */}
      {showInlineComposer && (
        <View style={styles.quickCommentRow}>
          <Ionicons name="chatbubble-outline" size={15} color={DiatinfColors.textMuted} />
          <TextInput
            value={quickComment}
            onChangeText={setQuickComment}
            placeholder="Escreva um comentário..."
            placeholderTextColor={DiatinfColors.textMuted}
            style={styles.quickInput}
            returnKeyType="send"
            onSubmitEditing={handleQuickComment}
          />
          <Pressable
            onPress={handleQuickComment}
            style={({ pressed }) => [
              styles.publishMiniBtn,
              !quickComment.trim() && styles.publishMiniDisabled,
              pressed && styles.pressed,
            ]}>
            <Text style={styles.publishMiniText}>Publicar</Text>
          </Pressable>
        </View>
      )}

      {/* First Comment Preview */}
      {post.firstComment && (
        <Pressable onPress={openPost} style={styles.previewBox}>
          <View
            style={[
              styles.miniAvatar,
              { backgroundColor: getAvatarColors(post.firstComment.author.username).bg },
            ]}>
            <Text style={styles.miniAvatarText}>
              {getInitials(post.firstComment.author.name)}
            </Text>
          </View>
          <View style={styles.previewBody}>
            <Text style={styles.previewHeader}>
              <Text style={styles.previewAuthor}>{post.firstComment.author.name}</Text>{' '}
              <Text style={styles.previewHandle}>@{post.firstComment.author.username}</Text>
            </Text>
            <Text style={styles.previewText} numberOfLines={2}>
              {post.firstComment.content}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
    gap: 10,
    shadowColor: DiatinfColors.navy,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
  authorMeta: {
    flex: 1,
    minWidth: 0,
  },
  nameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  badge: {
    backgroundColor: DiatinfColors.cream,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 99,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: DiatinfColors.orangeDark,
  },
  authorHandle: {
    fontSize: 12,
    color: DiatinfColors.textMuted,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
    color: DiatinfColors.textMuted,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: DiatinfColors.dangerBg,
  },
  contentWrap: {
    paddingVertical: 2,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 21,
    color: DiatinfColors.text,
  },
  hashtag: {
    color: DiatinfColors.orangeDark,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(12, 52, 83, 0.08)',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: DiatinfColors.navy,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  commentBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: DiatinfColors.surfaceMuted,
  },
  likeBtnActive: {
    backgroundColor: DiatinfColors.cream,
  },
  likeText: {
    fontSize: 12,
    fontWeight: '700',
    color: DiatinfColors.textMuted,
  },
  likeTextActive: {
    color: DiatinfColors.orangeDark,
  },
  quickCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: DiatinfColors.surfaceMuted,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
  },
  quickInput: {
    flex: 1,
    fontSize: 13,
    color: DiatinfColors.navy,
    paddingVertical: 2,
  },
  publishMiniBtn: {
    backgroundColor: DiatinfColors.orange,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  publishMiniDisabled: {
    opacity: 0.5,
  },
  publishMiniText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: DiatinfColors.creamSoft,
    padding: 10,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: DiatinfColors.orange,
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  previewBody: {
    flex: 1,
    gap: 2,
  },
  previewHeader: {
    fontSize: 12,
  },
  previewAuthor: {
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  previewHandle: {
    color: DiatinfColors.textMuted,
  },
  previewText: {
    fontSize: 13,
    color: DiatinfColors.text,
  },
  pressed: {
    opacity: 0.8,
  },
});
