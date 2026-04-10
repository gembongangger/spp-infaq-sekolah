import { r as readable, w as writable } from "./index.js";
import { h as healthCheck, t as transaksiApi, s as siswaApi, k as kategoriApi } from "./api.js";
const apiConnected = writable(false);
readable(false, (set) => {
  async function checkConnection() {
    try {
      const isHealthy = await healthCheck();
      set(isHealthy);
      apiConnected.set(isHealthy);
    } catch {
      set(false);
      apiConnected.set(false);
    }
  }
  checkConnection();
  const interval = setInterval(checkConnection, 3e4);
  return () => clearInterval(interval);
});
const students = writable([]);
const studentsLoading = writable(false);
const studentsError = writable(null);
async function loadStudents() {
  studentsLoading.set(true);
  studentsError.set(null);
  try {
    const data = await siswaApi.getAll();
    students.set(data);
  } catch (error) {
    studentsError.set(error instanceof Error ? error.message : "Failed to load students");
  } finally {
    studentsLoading.set(false);
  }
}
const transactions = writable([]);
const transactionsLoading = writable(false);
const transactionsError = writable(null);
async function loadTransactions(filters) {
  transactionsLoading.set(true);
  transactionsError.set(null);
  try {
    const data = await transaksiApi.getAll(filters);
    transactions.set(data);
  } catch (error) {
    transactionsError.set(error instanceof Error ? error.message : "Failed to load transactions");
  } finally {
    transactionsLoading.set(false);
  }
}
const categories = writable([]);
async function loadKategori() {
  try {
    const data = await kategoriApi.getAll();
    categories.set(data);
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
}
const stats = writable({
  totalInfaq: 0,
  totalJariyah: 0,
  totalKeluar: 0,
  saldo: 0
});
const statsLoading = writable(false);
async function loadStats() {
  statsLoading.set(true);
  try {
    const data = await transaksiApi.getStats();
    stats.set(data);
  } catch (error) {
    console.error("Failed to load stats:", error);
  } finally {
    statsLoading.set(false);
  }
}
const senderSummaries = writable([]);
async function loadSenders() {
  try {
    const data = await transaksiApi.getSenders();
    senderSummaries.set(data);
  } catch (error) {
    console.error("Failed to load senders:", error);
  }
}
const activeTab = writable("dashboard");
const theme = writable("dark");
async function deleteTransaction(id) {
  try {
    await transaksiApi.delete(id);
    transactions.update((t) => t.filter((item) => item.id !== id));
    await loadStats();
    await loadSenders();
  } catch (error) {
    throw error;
  }
}
export {
  activeTab as a,
  apiConnected as b,
  categories as c,
  deleteTransaction as d,
  transactions as e,
  stats as f,
  senderSummaries as g,
  loadStudents as h,
  loadTransactions as i,
  loadSenders as j,
  loadKategori as k,
  loadStats as l,
  students as s,
  theme as t
};
