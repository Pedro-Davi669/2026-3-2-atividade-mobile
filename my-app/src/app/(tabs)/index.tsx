import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { DiatinfHeader } from '@/components/DiatinfHeader';
import { PostCard } from '@/components/PostCard';
import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';

type FilterMode = 'recent' | 'rated';

export default function HomeFeedScreen() {
  const router = useRouter();
  const { currentUser, posts, createPost } = useDiatinf();
  const [filter, setFilter] = useState<FilterMode>('recent');
  const [draft, setDraft] = useState('');

  const feedPosts = useMemo(() => {
    const othersOrAll = posts;
    if (filter === 'rated') {
      return [...othersOrAll].sort(
        (a, b) => b.rating.average - a.rating.average || b.rating.count - a.rating.count
      );
    }
    return othersOrAll;
  }, [filter, posts]);

  const handleQuickPublish = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (!draft.trim()) return;
    createPost(draft);
    setDraft('');
  };

  return (
    <View style={styles.screen}>
      <DiatinfHeader />

      <FlatList
        data={feedPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <Text style={styles.pageTitle}>Feed Global</Text>

              <View style={styles.filterPills}>
                <Pressable
                  onPress={() => setFilter('recent')}
                  style={[styles.pill, filter === 'recent' && styles.pillActive]}>
                  <Ionicons
                    name="time-outline"
                    size={13}
                    color={filter === 'recent' ? '#FFFFFF' : DiatinfColors.navy}
                  />
                  <Text style={[styles.pillText, filter === 'recent' && styles.pillTextActive]}>
                    Recentes
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setFilter('rated')}
                  style={[styles.pill, filter === 'rated' && styles.pillActive]}>
                  <Ionicons
                    name="star"
                    size={13}
                    color={filter === 'rated' ? DiatinfColors.gold : DiatinfColors.orangeDark}
                  />
                  <Text style={[styles.pillText, filter === 'rated' && styles.pillTextActive]}>
                    Avaliados
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Quick Text Composer */}
            <View style={styles.composerCard}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={
                  currentUser
                    ? `O que você está criando hoje, ${currentUser.name.split(' ')[0]}?`
                    : 'Entre para publicar no Diatinf X...'
                }
                placeholderTextColor={DiatinfColors.textMuted}
                multiline
                maxLength={280}
                style={styles.composerInput}
              />
              <View style={styles.composerFooter}>
                <Text style={styles.composerHint}>Somente texto · #tags</Text>
                <Pressable
                  onPress={handleQuickPublish}
                  style={({ pressed }) => [
                    styles.publishBtn,
                    !draft.trim() && styles.publishBtnDisabled,
                    pressed && styles.pressed,
                  ]}>
                  <Ionicons name="send" size={14} color="#FFFFFF" />
                  <Text style={styles.publishBtnText}>Publicar</Text>
                </Pressable>
              </View>
            </View>
          </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: DiatinfColors.navy,
  },
  filterPills: {
    flexDirection: 'row',
    backgroundColor: 'rgba(12, 52, 83, 0.08)',
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pillActive: {
    backgroundColor: DiatinfColors.navy,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  composerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
    gap: 8,
  },
  composerInput: {
    minHeight: 48,
    fontSize: 14,
    color: DiatinfColors.navy,
    textAlignVertical: 'top',
  },
  composerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  composerHint: {
    fontSize: 11,
    color: DiatinfColors.textMuted,
    fontWeight: '600',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: DiatinfColors.orange,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  publishBtnDisabled: {
    opacity: 0.55,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
