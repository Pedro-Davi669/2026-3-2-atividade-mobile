import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';
import { getAvatarColors, getInitials } from '@/lib/format';

export function DiatinfHeader({ showSubBar = true }: { showSubBar?: boolean }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser } = useDiatinf();

  const avatarColor = currentUser
    ? getAvatarColors(currentUser.username)
    : { bg: DiatinfColors.orange, text: '#FFFFFF' };

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) }]}>
      <Text style={styles.brandTitle}>Diatinf X</Text>

      {showSubBar && (
        <View style={styles.subBar}>
          <Pressable
            style={styles.userInfo}
            onPress={() =>
              currentUser
                ? router.push({ pathname: '/profile/[username]', params: { username: currentUser.username } })
                : router.push('/login')
            }>
            <View style={[styles.avatar, { backgroundColor: avatarColor.bg }]}>
              <Text style={[styles.avatarText, { color: avatarColor.text }]}>
                {currentUser ? getInitials(currentUser.name) : '?'}
              </Text>
            </View>
            <View style={styles.userTextWrap}>
              <Text style={styles.userName} numberOfLines={1}>
                {currentUser ? currentUser.name : 'Visitante'}
              </Text>
              <Text style={styles.userHandle} numberOfLines={1}>
                {currentUser ? `@${currentUser.username}` : 'Toque para entrar'}
              </Text>
            </View>
          </Pressable>

          <View style={styles.actionGroup}>
            <Pressable
              accessibilityLabel="Pesquisar publicações"
              style={({ pressed }) => [styles.orangeBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/explore')}>
              <Ionicons name="search" size={18} color="#FFFFFF" />
            </Pressable>

            <Pressable
              accessibilityLabel="Nova publicação"
              style={({ pressed }) => [styles.orangeBtn, pressed && styles.pressed]}
              onPress={() => router.push(currentUser ? '/new-post' : '/login')}>
              <Ionicons name="add" size={21} color="#FFFFFF" />
            </Pressable>

            <Pressable
              accessibilityLabel="Conta e menu"
              style={({ pressed }) => [styles.menuBtn, pressed && styles.pressed]}
              onPress={() => router.push('/login')}>
              <Ionicons name="menu" size={23} color={DiatinfColors.gold} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: DiatinfColors.navy,
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: DiatinfColors.orange,
  },
  brandTitle: {
    textAlign: 'center',
    color: DiatinfColors.gold,
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: DiatinfColors.gold,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
  userTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  userHandle: {
    color: DiatinfColors.steel,
    fontSize: 12,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  orangeBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: DiatinfColors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBtn: {
    width: 32,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
});
