import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';
import { getAvatarColors, getInitials } from '@/lib/format';

const QUICK_TAGS = ['#diatinfx', '#infoweb', '#devlife', '#criatividade', '#a11y'];

export default function NewPostScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentUser, createPost } = useDiatinf();
  const [content, setContent] = useState('');

  const handlePublish = () => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }
    if (!content.trim()) return;
    createPost(content);
    router.back();
  };

  const addTag = (tag: string) => {
    setContent((prev) => (prev.trim() ? `${prev.trim()} ${tag}` : tag));
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 10) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={DiatinfColors.gold} />
        </Pressable>
        <Text style={styles.topTitle}>Nova Publicação</Text>
        <Pressable
          onPress={handlePublish}
          style={[styles.publishHeaderBtn, !content.trim() && styles.disabled]}>
          <Text style={styles.publishHeaderText}>Publicar</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {currentUser && (
          <View style={styles.userRow}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: getAvatarColors(currentUser.username).bg },
              ]}>
              <Text style={styles.avatarText}>{getInitials(currentUser.name)}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userHandle}>@{currentUser.username}</Text>
            </View>
          </View>
        )}

        <View style={styles.editorCard}>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Compartilhe uma ideia, dúvida ou projeto (somente texto)..."
            placeholderTextColor={DiatinfColors.textMuted}
            multiline
            maxLength={280}
            autoFocus
            style={styles.input}
          />
          <Text style={styles.counter}>{content.length}/280</Text>
        </View>

        <View style={styles.tagsWrap}>
          <Text style={styles.tagsLabel}>Adicionar hashtags:</Text>
          <View style={styles.tagsRow}>
            {QUICK_TAGS.map((tag) => (
              <Pressable key={tag} onPress={() => addTag(tag)} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
              </Pressable>
            ))}
          </View>
        </View>
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
    padding: 4,
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  publishHeaderBtn: {
    backgroundColor: DiatinfColors.orange,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  publishHeaderText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  body: {
    padding: 16,
    gap: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  userHandle: {
    fontSize: 12,
    color: DiatinfColors.textMuted,
  },
  editorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
    gap: 8,
  },
  input: {
    minHeight: 130,
    fontSize: 16,
    lineHeight: 22,
    color: DiatinfColors.navy,
    textAlignVertical: 'top',
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: DiatinfColors.textMuted,
    fontWeight: '600',
  },
  tagsWrap: {
    gap: 8,
  },
  tagsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
  },
  tagChipText: {
    color: DiatinfColors.orangeDark,
    fontWeight: '700',
    fontSize: 12,
  },
});
