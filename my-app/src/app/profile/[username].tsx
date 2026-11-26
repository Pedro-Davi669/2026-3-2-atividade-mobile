import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostCard } from '@/components/PostCard';
import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';
import { getAvatarColors, getInitials } from '@/lib/format';

export default function ProfileScreen() {
  const { username = '' } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getUserByUsername, getUserCounts, posts } = useDiatinf();

  const profileUser = getUserByUsername(username);
  const userPosts = useMemo(
    () => (profileUser ? posts.filter((p) => p.author.id === profileUser.id) : []),
    [posts, profileUser]
  );
  const counts = profileUser ? getUserCounts(profileUser.id) : { posts: 0, comments: 0 };

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 10) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={DiatinfColors.gold} />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
        <Text style={styles.topTitle}>Perfil Público</Text>
        <View style={{ width: 64 }} />
      </View>

      {!profileUser ? (
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundText}>Usuário @{username} não encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerContent}>
              <View style={styles.profileCard}>
                <View style={styles.profileRow}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: getAvatarColors(profileUser.username).bg },
                    ]}>
                    <Text style={styles.avatarText}>{getInitials(profileUser.name)}</Text>
                  </View>
                  <View style={styles.meta}>
                    <Text style={styles.name}>{profileUser.name}</Text>
                    <Text style={styles.handle}>@{profileUser.username}</Text>
                    <Text style={styles.bio}>{profileUser.bio}</Text>
                  </View>
                </View>

                <View style={styles.countersRow}>
                  <View style={styles.counterPill}>
                    <Text style={styles.counterVal}>{counts.posts}</Text>
                    <Text style={styles.counterLabel}>publicações</Text>
                  </View>
                  <View style={styles.counterPill}>
                    <Text style={styles.counterVal}>{counts.comments}</Text>
                    <Text style={styles.counterLabel}>comentários</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Publicações de {profileUser.name}</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Nenhuma publicação realizada ainda.</Text>
            </View>
          }
          renderItem={({ item }) => <PostCard post={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
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
  listContent: {
    padding: 14,
    paddingBottom: 32,
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: DiatinfColors.navy,
  },
  handle: {
    fontSize: 13,
    fontWeight: '600',
    color: DiatinfColors.orangeDark,
  },
  bio: {
    fontSize: 13,
    color: DiatinfColors.textMuted,
    marginTop: 2,
  },
  countersRow: {
    flexDirection: 'row',
    gap: 10,
  },
  counterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: DiatinfColors.creamSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  counterVal: {
    fontSize: 14,
    fontWeight: '800',
    color: DiatinfColors.navy,
  },
  counterLabel: {
    fontSize: 12,
    color: DiatinfColors.textMuted,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: DiatinfColors.navy,
  },
  notFoundCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  notFoundText: {
    color: DiatinfColors.navy,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: DiatinfColors.textMuted,
    fontSize: 13,
  },
});
