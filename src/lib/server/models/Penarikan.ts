/**
 * Penarikan Model
 */
import db from "$lib/server/db";
import { v4 as uuidv4 } from "uuid";

export interface PermintaanPenarikan {
  id: string;
  sekolah_id: string;
  jumlah: number;
  keterangan: string | null;
  status: string;
  dibuat_oleh: string;
  diproses_oleh: string | null;
  tanggal_diproses: string | null;
  created_at: string;
  updated_at: string;
}

export interface PermintaanPenarikanWithUser extends PermintaanPenarikan {
  nama_pembuat: string | null;
  sekolah_nama: string | null;
  nama_pengolah: string | null;
}

export interface CreatePenarikanInput {
  sekolah_id: string;
  jumlah: number;
  keterangan?: string;
  dibuat_oleh: string;
}

export const Penarikan = {
  /** Convert raw DB row to DTO */
  toDTO(penarikan: PermintaanPenarikan) {
    return penarikan;
  },

  /** Get all permintaan penarikan */
  async getAll(
    sekolahId?: string,
    status?: string,
  ): Promise<PermintaanPenarikanWithUser[]> {
    let sql = `
			SELECT 
				pp.*,
				u.nama_lengkap as nama_pembuat,
				s.nama as sekolah_nama,
				pu.nama_lengkap as nama_pengolah
			FROM permintaan_penarikan pp
			LEFT JOIN user u ON pp.dibuat_oleh = u.id
			LEFT JOIN sekolah s ON pp.sekolah_id = s.id
			LEFT JOIN user pu ON pp.diproses_oleh = pu.id
			WHERE 1=1
		`;
    const args: (string | undefined)[] = [];

    if (sekolahId) {
      sql += " AND pp.sekolah_id = ?";
      args.push(sekolahId);
    }

    if (status) {
      sql += " AND pp.status = ?";
      args.push(status);
    }

    sql += " ORDER BY pp.created_at DESC";

    const result = await db.execute({
      sql,
      args,
    });
    return result.rows as unknown as PermintaanPenarikanWithUser[];
  },

  /** Get permintaan penarikan by ID */
  async getById(id: string): Promise<PermintaanPenarikan | null> {
    const result = await db.execute({
      sql: "SELECT * FROM permintaan_penarikan WHERE id = ?",
      args: [id],
    });
    if (result.rows.length === 0) return null;
    return result.rows[0] as unknown as PermintaanPenarikan;
  },

  /** Get permintaan penarikan by ID with user info */
  async getByIdWithUser(
    id: string,
  ): Promise<PermintaanPenarikanWithUser | null> {
    const result = await db.execute({
      sql: `
        SELECT 
          pp.*,
          u.nama_lengkap as nama_pembuat,
          s.nama as sekolah_nama,
          pu.nama_lengkap as nama_pengolah
        FROM permintaan_penarikan pp
        LEFT JOIN user u ON pp.dibuat_oleh = u.id
        LEFT JOIN sekolah s ON pp.sekolah_id = s.id
        LEFT JOIN user pu ON pp.diproses_oleh = pu.id
        WHERE pp.id = ?
      `,
      args: [id],
    });
    if (result.rows.length === 0) return null;
    return result.rows[0] as unknown as PermintaanPenarikanWithUser;
  },

  /** Create new permintaan penarikan */
  async create(data: CreatePenarikanInput): Promise<PermintaanPenarikan> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await db.execute({
      sql: `
				INSERT INTO permintaan_penarikan 
				(id, sekolah_id, jumlah, keterangan, status, dibuat_oleh, created_at, updated_at)
				VALUES (?, ?, ?, ?, 'menunggu', ?, ?, ?)
			`,
      args: [
        id,
        data.sekolah_id,
        data.jumlah,
        data.keterangan || null,
        data.dibuat_oleh,
        now,
        now,
      ],
    });

    const penarikan = await this.getById(id);
    return penarikan!;
  },

  /** Approve permintaan penarikan */
  async approve(id: string, superadminId: string): Promise<boolean> {
    const now = new Date().toISOString();
    const result = await db.execute({
      sql: `
				UPDATE permintaan_penarikan
				SET status = 'disetujui', diproses_oleh = ?, tanggal_diproses = ?, updated_at = ?
				WHERE id = ? AND status = 'menunggu'
			`,
      args: [superadminId, now, now, id],
    });
    return result.rowsAffected > 0;
  },

  /** Reject permintaan penarikan */
  async reject(id: string, superadminId: string): Promise<boolean> {
    const now = new Date().toISOString();
    const result = await db.execute({
      sql: `
				UPDATE permintaan_penarikan
				SET status = 'ditolak', diproses_oleh = ?, tanggal_diproses = ?, updated_at = ?
				WHERE id = ? AND status = 'menunggu'
			`,
      args: [superadminId, now, now, id],
    });
    return result.rowsAffected > 0;
  },

  /** Get count by status */
  async getCountByStatus(status: string): Promise<number> {
    const result = await db.execute({
      sql: "SELECT COUNT(*) as count FROM permintaan_penarikan WHERE status = ?",
      args: [status],
    });
    return (result.rows[0] as unknown as { count: number }).count;
  },
};
