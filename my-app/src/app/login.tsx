import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DiatinfColors } from '@/constants/diatinf-theme';
import { useDiatinf } from '@/contexts/DiatinfContext';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentUser, login, register, logout, switchUser } = useDiatinf();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (mode === 'login') {
      const res = login(username, password);
      if (!res.ok) {
        setError(res.error ?? 'Erro ao entrar.');
        return;
      }
      router.back();
    } else {
      const res = register({ username, name });
      if (!res.ok) {
        setError(res.error ?? 'Erro ao criar conta.');
        return;
      }
      router.back();
    }
  };

  const quickSwitch = (uname: string) => {
    switchUser(uname);
    router.back();
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 10) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={DiatinfColors.gold} />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
        <Text style={styles.topTitle}>Conta Diatinf X</Text>
        <View style={{ width: 64 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {currentUser && (
          <View style={styles.activeCard}>
            <View>
              <Text style={styles.activeLabel}>Conectado como</Text>
              <Text style={styles.activeName}>{currentUser.name}</Text>
              <Text style={styles.activeHandle}>@{currentUser.username}</Text>
            </View>
            <Pressable style={styles.logoutBtn} onPress={logout}>
              <Ionicons name="log-out-outline" size={16} color={DiatinfColors.danger} />
              <Text style={styles.logoutText}>Sair</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.brand}>
            DIATINF <Text style={{ color: DiatinfColors.orange }}>X</Text>
          </Text>

          <View style={styles.tabsRow}>
            <Pressable
              onPress={() => setMode('login')}
              style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}>
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Entrar</Text>
            </Pressable>
            <Pressable
              onPress={() => setMode('register')}
              style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}>
              <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                Criar conta
              </Text>
            </Pressable>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.field}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholder="ex: pedrodavi"
              placeholderTextColor={DiatinfColors.textMuted}
              style={styles.input}
            />
          </View>

          {mode === 'register' && (
            <View style={styles.field}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="ex: Pedro Davi de Lima Fernandes"
                placeholderTextColor={DiatinfColors.textMuted}
                style={styles.input}
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="diatinf123"
              placeholderTextColor={DiatinfColors.textMuted}
              style={styles.input}
            />
          </View>

          <Pressable style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              {mode === 'login' ? 'Entrar na rede' : 'Cadastrar e entrar'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>Trocar rapidamente de conta (demo):</Text>
          <View style={styles.demoRow}>
            {['pedrodavi', 'alyssacavalcante', 'joaosouza', 'pedrolima'].map((uname) => (
              <Pressable
                key={uname}
                onPress={() => quickSwitch(uname)}
                style={[
                  styles.demoChip,
                  currentUser?.username === uname && styles.demoChipActive,
                ]}>
                <Text
                  style={[
                    styles.demoChipText,
                    currentUser?.username === uname && styles.demoChipTextActive,
                  ]}>
                  @{uname}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
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
  body: {
    padding: 16,
    gap: 14,
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeLabel: {
    fontSize: 11,
    color: DiatinfColors.textMuted,
    fontWeight: '600',
  },
  activeName: {
    fontSize: 15,
    fontWeight: '800',
    color: DiatinfColors.navy,
  },
  activeHandle: {
    fontSize: 12,
    color: DiatinfColors.orangeDark,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: DiatinfColors.dangerBg,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  logoutText: {
    color: DiatinfColors.danger,
    fontWeight: '700',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
    gap: 12,
  },
  brand: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: DiatinfColors.navy,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: DiatinfColors.surfaceMuted,
    borderRadius: 10,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: DiatinfColors.navy,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  errorText: {
    backgroundColor: DiatinfColors.dangerBg,
    color: DiatinfColors.danger,
    padding: 10,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  input: {
    backgroundColor: DiatinfColors.surfaceMuted,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: DiatinfColors.navy,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
  },
  submitBtn: {
    backgroundColor: DiatinfColors.orange,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  demoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
    gap: 8,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  demoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  demoChip: {
    backgroundColor: DiatinfColors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: DiatinfColors.border,
  },
  demoChipActive: {
    backgroundColor: DiatinfColors.navy,
    borderColor: DiatinfColors.navy,
  },
  demoChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: DiatinfColors.navy,
  },
  demoChipTextActive: {
    color: DiatinfColors.gold,
  },
});
