import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DiatinfHeader } from '@/components/DiatinfHeader';
import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';
import { getAvatarColors, getInitials } from '@/lib/format';
import type { InteractionStat } from '@/types/diatinf';

function StatGroup({
  title,
  items,
  onSelectUser,
}: {
  title: string;
  items: InteractionStat[];
  onSelectUser: (username: string) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.list}>
        {items.slice(0, 6).map(({ user, count }) => {
          const colors = getAvatarColors(user.username);
          return (
            <Pressable
              key={user.id}
              onPress={() => onSelectUser(user.username)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
              <View style={styles.leftRow}>
                <View style={[styles.avatar, { backgroundColor: colors.bg }]}>
                  <Text style={[styles.avatarText, { color: colors.text }]}>
                    {getInitials(user.name)}
                  </Text>
                </View>
                <View style={styles.nameWrap}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <Text style={styles.userHandle}>@{user.username}</Text>
                </View>
              </View>

              <View style={styles.countBox}>
                <Ionicons name="chatbox-outline" size={16} color={DiatinfColors.navy} />
                <Text style={styles.countText}>{count}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function SocialStatsScreen() {
  const router = useRouter();
  const { socialStats } = useDiatinf();

  const openProfile = (username: string) => {
    router.push({ pathname: '/profile/[username]', params: { username } });
  };

  return (
    <View style={styles.screen}>
      <DiatinfHeader showSubBar={false} />

      <View style={styles.subTabs}>
        <Text style={styles.subTabMuted}>Social Stats</Text>
        <View style={styles.subTabActiveWrap}>
          <Text style={styles.subTabActive}>Social Stats</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StatGroup
          title="Quem você mais comenta"
          items={socialStats.whoICommentMost}
          onSelectUser={openProfile}
        />

        <StatGroup
          title="Quem mais te comenta"
          items={socialStats.whoCommentsMeMost}
          onSelectUser={openProfile}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DiatinfColors.steelLight,
  },
  subTabs: {
    backgroundColor: DiatinfColors.navy,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  subTabMuted: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
    color: DiatinfColors.steel,
    fontSize: 13,
    fontWeight: '600',
  },
  subTabActiveWrap: {
    flex: 1,
    borderBottomWidth: 3,
    borderBottomColor: DiatinfColors.orange,
    paddingVertical: 10,
    alignItems: 'center',
  },
  subTabActive: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 22,
    paddingBottom: 28,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#091E2E',
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  rowPressed: {
    opacity: 0.78,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
  },
  nameWrap: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  userHandle: {
    fontSize: 11,
    color: DiatinfColors.textMuted,
  },
  countBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 15,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
});
