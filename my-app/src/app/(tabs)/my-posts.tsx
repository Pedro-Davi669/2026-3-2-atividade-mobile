import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { DiatinfHeader } from '@/components/DiatinfHeader';
import { PostCard } from '@/components/PostCard';
import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';
import { getAvatarColors, getInitials } from '@/lib/format';

export default function MyPostsScreen() {
  const router = useRouter();
  const { currentUser, posts, getUserCounts } = useDiatinf();

  const myPosts = useMemo(
    () => (currentUser ? posts.filter((p) => p.author.id === currentUser.id) : []),
    [currentUser, posts]
  );

  const counts = currentUser ? getUserCounts(currentUser.id) : { posts: 0, comments: 0 };

  return (
    <View style={styles.screen}>
      <DiatinfHeader />

      <FlatList
        data={myPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            {currentUser ? (
              <View style={styles.profileCard}>
                <View style={styles.profileTop}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: getAvatarColors(currentUser.username).bg },
                    ]}>
                    <Text style={styles.avatarText}>{getInitials(currentUser.name)}</Text>
                  </View>
                  <View style={styles.profileMeta}>
                    <Text style={styles.name}>{currentUser.name}</Text>
                    <Text style={styles.handle}>@{currentUser.username}</Text>
                    <Text style={styles.bio}>{currentUser.bio}</Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBadge}>
                    <Text style={styles.statNumber}>{counts.posts}</Text>
                    <Text style={styles.statLabel}>Publicações</Text>
                  </View>
                  <View style={styles.statBadge}>
                    <Text style={styles.statNumber}>{counts.comments}</Text>
                    <Text style={styles.statLabel}>Comentários</Text>
                  </View>
                  <Pressable
                    onPress={() => router.push('/new-post')}
                    style={({ pressed }) => [styles.newPostBtn, pressed && styles.pressed]}>
                    <Ionicons name="add-circle" size={16} color="#FFFFFF" />
                    <Text style={styles.newPostText}>Novo Post</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="person-circle-outline" size={40} color={DiatinfColors.navy} />
                <Text style={styles.emptyTitle}>Você não está conectado</Text>
                <Pressable style={styles.loginBtn} onPress={() => router.push('/login')}>
                  <Text style={styles.loginBtnText}>Entrar no Diatinf X</Text>
                </Pressable>
              </View>
            )}

            <Text style={styles.sectionTitle}>Minhas Publicações</Text>
          </View>
        }
        ListEmptyComponent={
          currentUser ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Você ainda não publicou nada</Text>
              <Text style={styles.emptySubtitle}>
                Toque no botão + acima para criar sua primeira publicação!
              </Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => <PostCard post={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DiatinfColors.cream,
  },
  listContent: {
    padding: 14,
    paddingBottom: 24,
  },
  headerContent: {
    gap: 12,
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
    gap: 12,
  },
  profileTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  profileMeta: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: DiatinfColors.navy,
  },
  handle: {
    fontSize: 12,
    fontWeight: '600',
    color: DiatinfColors.orangeDark,
  },
  bio: {
    fontSize: 12,
    color: DiatinfColors.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statBadge: {
    backgroundColor: DiatinfColors.creamSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: DiatinfColors.navy,
  },
  statLabel: {
    fontSize: 10,
    color: DiatinfColors.textMuted,
    fontWeight: '600',
  },
  newPostBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: DiatinfColors.orange,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  newPostText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DiatinfColors.navy,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  emptySubtitle: {
    fontSize: 13,
    color: DiatinfColors.textMuted,
    textAlign: 'center',
  },
  loginBtn: {
    backgroundColor: DiatinfColors.navy,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.8,
  },
});
