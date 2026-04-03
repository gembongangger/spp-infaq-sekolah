import { r as readable, w as writable } from "./index.js";
const apiConnected = writable(false);
readable(false, (set) => {
  async function checkConnection() {
    try {
      const response = await fetch("http://localhost:5000/api/health");
      const data = await response.json();
      set(data.success);
      apiConnected.set(data.success);
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
const transactions = writable([]);
const categories = writable([]);
const stats = writable({
  totalInfaq: 0,
  totalJariyah: 0,
  totalKeluar: 0,
  saldo: 0
});
const senderSummaries = writable([]);
const activeTab = writable("dashboard");
const theme = writable("dark");
export {
  activeTab as a,
  transactions as b,
  categories as c,
  stats as d,
  senderSummaries as e,
  apiConnected as f,
  students as s,
  theme as t
};
