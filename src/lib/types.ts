export enum Jenis {
  MASUK = "masuk",
  KELUAR = "keluar",
}

export enum Metode {
  TUNAI = "tunai",
  TRANSFER = "transfer",
}

export enum PenarikanStatus {
  MENUNGGU = "menunggu",
  DISETUJUI = "disetujui",
  DITOLAK = "ditolak",
}

export interface Siswa {
  id: string;
  nomorAkun: string;
  nama: string;
  kelas: string;
  createdAt: string;
}

export interface Transaksi {
  id: string;
  tanggal: string;
  keterangan: string;
  kategori: string;
  jenis: Jenis;
  jumlah: number;
  metode: Metode;
  siswaId?: string;
  namaPengirim?: string;
  kelasPengirim?: string;
  nomorAkun?: string;
  bulan?: string;
  createdAt: string;
}

export interface SenderSummary {
  id: string;
  nama: string;
  kelas: string;
  nomorAkun: string;
  totalInfaq: number;
  totalJariyah: number;
  totalDonasi: number;
  transactions: Transaksi[];
}

// API Response Types
export type TransaksiData = {
  id: string;
  tanggal: string;
  keterangan: string;
  kategori: string;
  jenis: "masuk" | "keluar";
  jumlah: number;
  metode: "tunai" | "transfer";
  siswaId?: string;
  namaPengirim?: string;
  kelasPengirim?: string;
  nomorAkun?: string;
  bulan?: string;
  createdAt: string;
  updatedAt: string;
};

export type SiswaData = {
  id: string;
  nomorAkun: string;
  nama: string;
  kelas: string;
  createdAt: string;
  updatedAt: string;
};
