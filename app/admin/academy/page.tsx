"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

// نفس ايميل الأدمن اللي استخدمناه في /admin
const ADMIN_EMAILS: string[] = ["hazemabomoghdeb2@gmail.com"];

// أنواع الحقول القادمة من Firestore
type ExperienceLevel = "beginner" | "intermediate" | "advanced";
type ContactStatus = "new" | "contacted" | "in_progress" | "closed";

interface AcademyRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  experienceLevel: ExperienceLevel;
  goal: string;
  createdAt: string;
  status: ContactStatus;
}

// لتحويل Snapshot من Firestore إلى كائن Typed
function mapDoc(snapshot: QueryDocumentSnapshot<DocumentData>): AcademyRequest {
  const data = snapshot.data();

  // createdAt قد يكون Timestamp
  let createdAtText = "";
  if (data.createdAt && typeof data.createdAt.toDate === "function") {
    createdAtText = data.createdAt.toDate().toLocaleString();
  } else if (typeof data.createdAt === "string") {
    createdAtText = data.createdAt;
  } else {
    createdAtText = "";
  }

  return {
    id: snapshot.id,
    fullName: String(data.fullName ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    experienceLevel: (data.experienceLevel ?? "beginner") as ExperienceLevel,
    goal: String(data.goal ?? ""),
    createdAt: createdAtText,
    status: (data.status ?? "new") as ContactStatus,
  };
}

// لتنسيق الـ Status بالشكل الجميل
function statusLabel(status: ContactStatus): string {
  switch (status) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "in_progress":
      return "In Progress";
    case "closed":
      return "Closed";
    default:
      return status;
  }
}

function statusClass(status: ContactStatus): string {
  switch (status) {
    case "new":
      return "bg-blue-900/40 text-blue-300 border-blue-500/60";
    case "contacted":
      return "bg-emerald-900/40 text-emerald-300 border-emerald-500/60";
    case "in_progress":
      return "bg-yellow-900/40 text-yellow-300 border-yellow-500/60";
    case "closed":
      return "bg-zinc-800/60 text-zinc-300 border-zinc-500/60";
    default:
      return "bg-zinc-800 text-zinc-200 border-zinc-600";
  }
}

export default function AdminAcademyPage(): JSX.Element {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [requests, setRequests] = useState<AcademyRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [levelFilter, setLevelFilter] = useState<ExperienceLevel | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ---------- التحقق من الأدمن ----------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      const emailLower = currentUser.email?.toLowerCase() ?? "";
      const allowed = ADMIN_EMAILS.includes(emailLower);
      setIsAdmin(allowed);
      setCheckingAdmin(false);
    });

    return () => unsubscribe();
  }, [router]);

  // ---------- تحميل طلبات الأكاديمية ----------
  const loadRequests = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // 👇 مهم: غيّر اسم المجموعة هنا حسب ما استخدمناه في صفحة الأكاديمية
      // مثال محتمل: "academyRequests" أو "training_requests"
      const colRef = collection(db, "academyRequests");

      const q = query(colRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const items: AcademyRequest[] = snapshot.docs.map(mapDoc);
      setRequests(items);
    } catch {
      setError("Failed to load academy registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  // ---------- تحديث حالة الطلب ----------
  const updateStatus = async (id: string, newStatus: ContactStatus): Promise<void> => {
    try {
      setSavingId(id);
      setError(null);

      const colRef = collection(db, "academyRequests");
      const docRef = doc(colRef, id);

      await updateDoc(docRef, { status: newStatus });

      // تحديث محلي
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: newStatus } : r
        )
      );
    } catch {
      setError("Failed to update status.");
    } finally {
      setSavingId(null);
    }
  };

  // ---------- فلترة / بحث ----------
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const byLevel = levelFilter === "all" ? true : req.experienceLevel === levelFilter;
      const byStatus = statusFilter === "all" ? true : req.status === statusFilter;

      const term = searchTerm.trim().toLowerCase();
      const bySearch =
        term.length === 0 ||
        req.fullName.toLowerCase().includes(term) ||
        req.email.toLowerCase().includes(term) ||
        req.phone.toLowerCase().includes(term);

      return byLevel && byStatus && bySearch;
    });
  }, [requests, levelFilter, statusFilter, searchTerm]);

  // ---------- حواجز الأدمن ----------
  if (checkingAdmin) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">Checking admin access…</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-red-900/25 border border-red-600/60 p-8 rounded-2xl shadow-xl shadow-red-900/60">
          <h1 className="text-2xl font-bold text-red-400 mb-3">Access Denied</h1>
          <p className="text-gray-200 text-sm mb-4">
            Only 3CHERRYFX admins can view training registrations.
          </p>
          <button
            onClick={() => router.push("/admin")}
            className="px-6 py-2 rounded-xl bg-zinc-900 border border-zinc-600 text-sm text-gray-100 hover:bg-zinc-800 transition"
          >
            Back to Admin Panel
          </button>
        </div>
      </main>
    );
  }

  // ---------- واجهة لوحة إدارة الأكاديمية ----------
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden px-4 md:px-8 py-8">
      {/* خلفيات */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-yellow-500/10 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[480px] h-[480px] bg-red-500/25 blur-[160px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* العنوان */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              Academy Leads Dashboard
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-2 max-w-2xl">
              All users who requested training on 3CHERRYFX. Track their experience
              level, goals, and follow-up status in one place.
            </p>
          </div>

          <div className="text-right text-xs text-gray-400">
            <p>Logged in as:</p>
            <p className="text-yellow-300 font-semibold">
              {user?.email ?? "Unknown"}
            </p>
          </div>
        </header>

        {/* زر إعادة تحميل */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <button
            onClick={() => void loadRequests()}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-black/60 border border-yellow-500/60 text-xs md:text-sm text-yellow-300 font-semibold hover:bg-yellow-500/10 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Refreshing…" : "Reload registrations"}
          </button>

          <div className="flex flex-wrap gap-2 justify-end">
            <input
              type="text"
              placeholder="Search name, email or phone…"
              className="px-3 py-2 rounded-lg bg-black/70 border border-zinc-700 text-xs text-gray-200 focus:outline-none focus:border-yellow-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={levelFilter}
              onChange={(e) =>
                setLevelFilter(e.target.value as ExperienceLevel | "all")
              }
              className="px-3 py-2 rounded-lg bg-black/70 border border-zinc-700 text-xs text-gray-200 focus:outline-none focus:border-yellow-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ContactStatus | "all")
              }
              className="px-3 py-2 rounded-lg bg-black/70 border border-zinc-700 text-xs text-gray-200 focus:outline-none focus:border-yellow-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* رسالة خطأ */}
        {error && (
          <div className="bg-red-900/40 border border-red-600/70 text-red-100 text-sm rounded-2xl p-4">
            {error}
          </div>
        )}

        {/* جدول الطلبات */}
        <section className="bg-black/80 border border-yellow-500/25 rounded-2xl overflow-hidden shadow-xl shadow-black/80">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead className="bg-zinc-950/90 border-b border-zinc-800">
                <tr className="text-left text-gray-300">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Goal</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No registrations match current filters.
                    </td>
                  </tr>
                )}

                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-t border-zinc-800 hover:bg-zinc-900/60 transition"
                  >
                    <td className="px-4 py-3 text-gray-100 whitespace-nowrap">
                      {req.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                      {req.email}
                    </td>
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                      {req.phone}
                    </td>
                    <td className="px-4 py-3 text-gray-200 whitespace-nowrap capitalize">
                      {req.experienceLevel}
                    </td>
                    <td className="px-4 py-3 text-gray-300 max-w-xs">
                      <span className="line-clamp-2">{req.goal}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {req.createdAt}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full border text-[11px] font-semibold ${statusClass(
                          req.status
                        )}`}
                      >
                        {statusLabel(req.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        <button
                          disabled={savingId === req.id}
                          onClick={() => void updateStatus(req.id, "new")}
                          className="px-2 py-1 rounded-lg border border-zinc-600 text-[11px] text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
                        >
                          New
                        </button>
                        <button
                          disabled={savingId === req.id}
                          onClick={() => void updateStatus(req.id, "contacted")}
                          className="px-2 py-1 rounded-lg border border-emerald-600 text-[11px] text-emerald-200 hover:bg-emerald-900/40 disabled:opacity-50"
                        >
                          Contacted
                        </button>
                        <button
                          disabled={savingId === req.id}
                          onClick={() => void updateStatus(req.id, "in_progress")}
                          className="px-2 py-1 rounded-lg border border-yellow-600 text-[11px] text-yellow-200 hover:bg-yellow-900/40 disabled:opacity-50"
                        >
                          In Progress
                        </button>
                        <button
                          disabled={savingId === req.id}
                          onClick={() => void updateStatus(req.id, "closed")}
                          className="px-2 py-1 rounded-lg border border-zinc-500 text-[11px] text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
                        >
                          Closed
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {loading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      Loading academy registrations…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
