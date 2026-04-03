import { r as readable, w as writable } from "./index.js";
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
async function fetchBlob(endpoint, options) {
  const url = `/api${endpoint}`;
  const response = await fetch(url, {
    ...options
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `API Error: ${response.status}`);
  }
  return await response.blob();
}
const siswaApi = {
  /** Get all siswa */
  getAll: async () => {
    const response = await fetchApi("/siswa");
    return response.data;
  },
  /** Search siswa with pagination */
  search: async (options) => {
    const params = new URLSearchParams();
    if (options.query) params.set("q", options.query);
    if (options.page) params.set("page", options.page.toString());
    if (options.limit) params.set("limit", options.limit.toString());
    const response = await fetchApi(`/siswa/search?${params.toString()}`);
    return {
      data: response.data,
      pagination: response.pagination
    };
  },
  /** Get siswa by ID */
  getById: async (id) => {
    const response = await fetchApi(`/siswa/${id}`);
    return response.data;
  },
  /** Create new siswa */
  create: async (data) => {
    const response = await fetchApi("/siswa", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return response.data;
  },
  /** Update siswa */
  update: async (id, data) => {
    const response = await fetchApi(`/siswa/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
    return response.data;
  },
  /** Delete siswa */
  delete: async (id) => {
    await fetchApi(`/siswa/${id}`, { method: "DELETE" });
  },
  /** Upload Excel file */
  uploadExcel: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const url = `/api/siswa/upload-excel`;
    const response = await fetch(url, {
      method: "POST",
      body: formData
    });
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      throw new Error(
        `Upload Excel gagal: response tidak valid JSON (status ${response.status}). Response body: ${text.substring(0, 300)}`
      );
    }
    if (!response.ok) {
      throw new Error(data?.message || `API Error: ${response.status}`);
    }
    return data.data;
  },
  /** Download template Excel */
  downloadTemplate: async () => {
    return await fetchBlob("/siswa/download-template");
  }
};
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
const kategoriApi = {
  /** Get all kategori */
  getAll: async () => {
    const response = await fetchApi("/kategori");
    return response.data;
  },
  /** Create new kategori */
  create: async (data) => {
    const response = await fetchApi("/kategori", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return response.data;
  },
  /** Delete kategori */
  delete: async (id) => {
    await fetchApi(`/kategori/${id}`, { method: "DELETE" });
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
