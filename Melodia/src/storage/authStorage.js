import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const ACCOUNTS_KEY = "@melodia/accounts/v1";
const SESSION_KEY = "@melodia/session/v1";

function normaliseEmail(email) {
  return email.trim().toLowerCase();
}

async function hashPassword(password, salt) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
  );
}

async function readAccounts() {
  const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];

  const accounts = JSON.parse(raw);
  if (!Array.isArray(accounts)) throw new Error("Saved accounts are invalid");
  return accounts;
}

export async function registerAccount({ name, email, password }) {
  const cleanName = name.trim();
  const cleanEmail = normaliseEmail(email);
  const accounts = await readAccounts();

  if (accounts.some((account) => account.email === cleanEmail)) {
    throw new Error("An account already uses this email");
  }

  const salt = Crypto.randomUUID();
  const account = {
    id: Crypto.randomUUID(),
    name: cleanName,
    email: cleanEmail,
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };

  await AsyncStorage.multiSet([
    [ACCOUNTS_KEY, JSON.stringify([...accounts, account])],
    [SESSION_KEY, account.id],
  ]);

  return publicAccount(account);
}

export async function loginAccount(email, password) {
  const accounts = await readAccounts();
  const account = accounts.find(
    (item) => item.email === normaliseEmail(email),
  );

  if (!account) throw new Error("Email or password is incorrect");

  const passwordHash = await hashPassword(password, account.salt);
  if (passwordHash !== account.passwordHash) {
    throw new Error("Email or password is incorrect");
  }

  await AsyncStorage.setItem(SESSION_KEY, account.id);
  return publicAccount(account);
}

export async function loadSession() {
  const accountId = await AsyncStorage.getItem(SESSION_KEY);
  if (!accountId) return null;

  const accounts = await readAccounts();
  const account = accounts.find((item) => item.id === accountId);
  return account ? publicAccount(account) : null;
}

export async function logoutAccount() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

function publicAccount(account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    createdAt: account.createdAt,
  };
}
