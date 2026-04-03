import { w as writable, r as readable } from "./index.js";
async function fetchApi(endpoint, options) {
  const url = `/api${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `API Error: ${response.status}`);
  }
  return data;
}
const transaksiApi = {
  /** Get all transaksi with optional filters */
  getAll: async (filters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== void 0) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/transaksi?${queryString}` : "/transaksi";
    const response = await fetchApi(endpoint);
    return response.data;
  },
  /** Get transaksi by ID */
  getById: async (id) => {
    const response = await fetchApi(`/transaksi/${id}`);
    return response.data;
  },
  /** Create new transaksi */
  create: async (data) => {
    const response = await fetchApi("/transaksi", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return response.data;
  },
  /** Update transaksi */
  update: async (id, data) => {
    const response = await fetchApi(`/transaksi/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
    return response.data;
  },
  /** Delete transaksi */
  delete: async (id) => {
    await fetchApi(`/transaksi/${id}`, { method: "DELETE" });
  },
  /** Get statistics */
  getStats: async () => {
    const response = await fetchApi("/transaksi/stats");
    return response.data;
  },
  /** Get sender summaries */
  getSenders: async () => {
    const response = await fetchApi("/transaksi/senders");
    return response.data;
  }
};
const healthCheck = async () => {
  try {
    const response = await fetchApi("/health");
    return response.success;
  } catch {
    return false;
  }
};
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
const transactions = writable([]);
const categories = writable([]);
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
  transactions as b,
  categories as c,
  stats as d,
  senderSummaries as e,
  apiConnected as f,
  deleteTransaction as g,
  students as s,
  theme as t
};
