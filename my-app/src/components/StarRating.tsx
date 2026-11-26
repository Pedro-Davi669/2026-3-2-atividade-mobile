import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';
import type { RatingSummary } from '@/types/diatinf';

type Props = {
  postId: string;
  rating: RatingSummary;
};

export function StarRating({ postId, rating }: Props) {
  const { currentUser, ratePost } = useDiatinf();
  const [expanded, setExpanded] = useState(false);

  const labelScore = rating.count > 0 ? rating.average.toFixed(1) : '0.0';

  const handleSelect = (val: 1 | 2 | 3) => {
    if (!currentUser) return;
    ratePost(postId, val);
    setExpanded(false);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => setExpanded((prev) => !prev)}
        style={({ pressed }) => [
          styles.badgeBtn,
          rating.myValue ? styles.badgeBtnRated : null,
          pressed && styles.pressed,
        ]}>
        <Ionicons name="star" size={14} color={DiatinfColors.gold} />
        <Text style={styles.badgeText}>Avaliar ({labelScore}</Text>
        <Ionicons name="star" size={11} color={DiatinfColors.gold} />
        <Text style={styles.badgeText}>)</Text>
      </Pressable>

      {expanded && (
        <View style={styles.starsBox}>
          {([1, 2, 3] as const).map((star) => {
            const active = (rating.myValue ?? Math.round(rating.average)) >= star;
            return (
              <Pressable
                key={star}
                onPress={() => handleSelect(star)}
                style={({ pressed }) => [styles.starBtn, pressed && styles.pressed]}
                accessibilityLabel={`Avaliar com ${star} estrelas`}>
                <Ionicons
                  name={active ? 'star' : 'star-outline'}
                  size={20}
                  color={active ? DiatinfColors.gold : DiatinfColors.steel}
                />
              </Pressable>
            );
          })}
          <Text style={styles.countText}>
            {rating.myValue ? `Sua: ${rating.myValue}★` : `${rating.count} votos`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-end',
    gap: 6,
  },
  badgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: DiatinfColors.surfaceMuted,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
  },
  badgeBtnRated: {
    backgroundColor: DiatinfColors.creamSoft,
    borderColor: DiatinfColors.gold,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  starsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
  },
  starBtn: {
    padding: 2,
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: DiatinfColors.textMuted,
    marginLeft: 2,
  },
  pressed: {
    opacity: 0.75,
  },
});
