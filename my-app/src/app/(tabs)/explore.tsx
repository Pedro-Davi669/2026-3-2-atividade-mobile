import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { DiatinfHeader } from '@/components/DiatinfHeader';
import { PostCard } from '@/components/PostCard';
import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';

const TRENDING_TAGS = ['#diatinfx', '#criatividade', '#devlife', '#a11y', '#infoweb', '#typescript'];

export default function ExploreSearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const { posts } = useDiatinf();
  const [query, setQuery] = useState(params.q ?? '');

  useEffect(() => {
    if (typeof params.q === 'string') {
      setQuery(params.q);
    }
  }, [params.q]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.content.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.author.username.toLowerCase().includes(q)
    );
  }, [posts, query]);

  return (
    <View style={styles.screen}>
      <DiatinfHeader />

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <Text style={styles.pageTitle}>Explorar & Pesquisar</Text>

            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={DiatinfColors.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar publicações, #tags ou usuários..."
                placeholderTextColor={DiatinfColors.textMuted}
                style={styles.searchInput}
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery('')}>
                  <Ionicons name="close-circle" size={18} color={DiatinfColors.textMuted} />
                </Pressable>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsRow}>
              {TRENDING_TAGS.map((tag) => {
                const active = query.trim().toLowerCase() === tag;
                return (
                  <Pressable
                    key={tag}
                    onPress={() => setQuery(active ? '' : tag)}
                    style={[styles.tagChip, active && styles.tagChipActive]}>
                    <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Ionicons name="search-outline" size={32} color={DiatinfColors.orange} />
            <Text style={styles.emptyTitle}>Nenhuma publicação encontrada</Text>
            <Text style={styles.emptySubtitle}>
              Tente outro termo ou toque em uma das tags acima.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <PostCard post={item} onHashtagPress={(tag) => setQuery(tag)} />
        )}
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
    gap: 10,
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: DiatinfColors.navy,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: DiatinfColors.navy,
  },
  tagsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  tagChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
  },
  tagChipActive: {
    backgroundColor: DiatinfColors.orange,
    borderColor: DiatinfColors.orange,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  tagTextActive: {
    color: '#FFFFFF',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 6,
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
});
