import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, LogOut, Loader2 } from "lucide-react";

type LeadStatus = "new" | "in_progress" | "closed_won" | "closed_lost";

interface Lead {
  id: string;
  created_at: string;
  name: string | null;
  business_type: string;
  main_problem: string;
  urgency_level: string;
  language: string;
  status: LeadStatus;
  consent_given: boolean;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/login");
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchLeads();
  }, [isAdmin]);

  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads((data as Lead[]) || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: LeadStatus) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const exportCSV = () => {
    const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter);
    const headers = ["Date", "Name", "Business Type", "Main Problem", "Urgency", "Language", "Status"];
    const rows = filtered.map(l => [new Date(l.created_at).toLocaleDateString(), l.name || "-", l.business_type, l.main_problem, l.urgency_level, l.language, l.status]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  const getStatusColor = (status: LeadStatus) => {
    const colors = { new: "bg-blue-100 text-blue-800", in_progress: "bg-yellow-100 text-yellow-800", closed_won: "bg-green-100 text-green-800", closed_lost: "bg-red-100 text-red-800" };
    return colors[status];
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-display text-xl font-bold">{t("dashboard.title")}</h1>
          <Button variant="ghost" onClick={signOut} className="text-primary-foreground hover:bg-primary-foreground/10 gap-2">
            <LogOut className="h-4 w-4" />{t("dashboard.logout")}
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder={t("dashboard.filter")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("dashboard.status.all")}</SelectItem>
              <SelectItem value="new">{t("dashboard.status.new")}</SelectItem>
              <SelectItem value="in_progress">{t("dashboard.status.in_progress")}</SelectItem>
              <SelectItem value="closed_won">{t("dashboard.status.closed_won")}</SelectItem>
              <SelectItem value="closed_lost">{t("dashboard.status.closed_lost")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportCSV} className="gap-2"><Download className="h-4 w-4" />{t("dashboard.export")}</Button>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{t("dashboard.noLeads")}</p>
        ) : (
          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Main Problem</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Lang</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(lead => (
                  <TableRow key={lead.id}>
                    <TableCell className="whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{lead.name || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{lead.business_type}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{lead.main_problem}</TableCell>
                    <TableCell>{lead.urgency_level}</TableCell>
                    <TableCell>{lead.language.toUpperCase()}</TableCell>
                    <TableCell>
                      <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v as LeadStatus)}>
                        <SelectTrigger className="w-32"><Badge className={getStatusColor(lead.status)}>{lead.status.replace("_", " ")}</Badge></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">{t("dashboard.status.new")}</SelectItem>
                          <SelectItem value="in_progress">{t("dashboard.status.in_progress")}</SelectItem>
                          <SelectItem value="closed_won">{t("dashboard.status.closed_won")}</SelectItem>
                          <SelectItem value="closed_lost">{t("dashboard.status.closed_lost")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
