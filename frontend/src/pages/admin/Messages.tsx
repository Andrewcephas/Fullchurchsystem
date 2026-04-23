import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Mail, MailOpen, Search, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/contexts/AuthContext";

const Messages = () => {
  const { user } = useAuth();
  const { isSuperAdmin } = useUserRole();
  const [messages, setMessages] = useState<any[]>([]);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [filteredRecipients, setFilteredRecipients] = useState<any[]>([]);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { toast } = useToast();

  const currentUserId = user?.id;

  const fetchAll = async () => {
    setLoading(true);
    // Fetch all admins/pastors from user roles
    const rolesResponse = await apiService.getUserRoles();
    const roles = (rolesResponse.data as any)?.results || rolesResponse.data || [];
    // Filter out current user
    const otherAdmins = roles.filter(
      (r: any) => String(r.user_id) !== String(currentUserId) && String(r.user) !== String(currentUserId)
    );
    setRecipients(otherAdmins);
    setFilteredRecipients(otherAdmins);

    // Fetch messages involving current user
    const [sentRes, receivedRes] = await Promise.all([
      apiService.getPrivateMessages({ sender: currentUserId }),
      apiService.getPrivateMessages({ receiver: currentUserId }),
    ]);
    const sent = (sentRes.data as any)?.results || sentRes.data || [];
    const received = (receivedRes.data as any)?.results || receivedRes.data || [];
    const all = [...sent, ...received].sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    // Deduplicate by id
    const seen = new Set();
    setMessages(all.filter((m: any) => { if (seen.has(m.id)) return false; seen.add(m.id); return true; }));
    setLoading(false);
  };

  useEffect(() => {
    if (currentUserId) fetchAll();
  }, [currentUserId]);

  useEffect(() => {
    if (!recipientSearch) {
      setFilteredRecipients(recipients);
    } else {
      const q = recipientSearch.toLowerCase();
      setFilteredRecipients(
        recipients.filter((r: any) =>
          (r.user_email || "").toLowerCase().includes(q) ||
          (r.branch_name || "").toLowerCase().includes(q) ||
          (r.role || "").toLowerCase().includes(q)
        )
      );
    }
  }, [recipientSearch, recipients]);

  const getRecipientLabel = (r: any) => {
    const role = r.role === "super_admin" ? "Bishop" : r.role === "branch_admin" ? "Pastor" : r.role;
    const branch = r.branch_name ? ` — ${r.branch_name}` : "";
    const email = r.user_email ? ` (${r.user_email})` : "";
    return `${role}${branch}${email}`;
  };

  const getAdminLabel = (userId: string) => {
    const admin = recipients.find((r: any) => String(r.user_id) === String(userId) || String(r.user) === String(userId));
    if (!admin) return `User #${String(userId).slice(0, 6)}`;
    return getRecipientLabel(admin);
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedRecipient) {
      toast({ title: "Select a recipient and type a message", variant: "destructive" });
      return;
    }
    setSending(true);
    const recipientId = selectedRecipient.user_id || selectedRecipient.user;
    const response = await apiService.createPrivateMessage({ receiver_id: recipientId, message });
    setSending(false);
    if (response.error) {
      toast({ title: "Error", description: response.error, variant: "destructive" });
      return;
    }
    toast({ title: "Message sent ✓" });
    setMessage("");
    setSelectedRecipient(null);
    setRecipientSearch("");
    fetchAll();
  };

  const markRead = async (id: string) => {
    await apiService.updatePrivateMessage(id, { is_read: true });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const unreadCount = messages.filter(m => !m.is_read && String(m.receiver_id || m.receiver) === String(currentUserId)).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-foreground">Private Messages</h2>
          {unreadCount > 0 && <p className="text-sm text-muted-foreground">{unreadCount} unread message{unreadCount > 1 ? "s" : ""}</p>}
        </div>
        <Button variant="outline" size="icon" onClick={fetchAll}><RefreshCw className="h-4 w-4" /></Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" />Send Message</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Label>To *</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={selectedRecipient ? getRecipientLabel(selectedRecipient) : recipientSearch}
                onChange={e => { setRecipientSearch(e.target.value); setSelectedRecipient(null); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search by name, branch, or role..."
                className="pl-10"
              />
            </div>
            {showDropdown && !selectedRecipient && filteredRecipients.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-background border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredRecipients.map((r: any) => (
                  <button
                    key={r.id}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted text-sm border-b last:border-0 transition-colors"
                    onClick={() => { setSelectedRecipient(r); setShowDropdown(false); setRecipientSearch(""); }}
                  >
                    <p className="font-medium">{getRecipientLabel(r)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedRecipient && (
            <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
              <Badge className="bg-primary text-primary-foreground">{selectedRecipient.role === "super_admin" ? "Bishop" : "Pastor"}</Badge>
              <span className="text-sm font-medium">{selectedRecipient.user_email}</span>
              <button className="ml-auto text-xs text-muted-foreground hover:text-destructive" onClick={() => setSelectedRecipient(null)}>✕</button>
            </div>
          )}
          <div>
            <Label>Message *</Label>
            <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your private message..." rows={3} className="mt-1.5" />
          </div>
          <Button onClick={handleSend} disabled={sending || !selectedRecipient || !message.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {sending ? "Sending..." : <><Send className="h-4 w-4 mr-2" />Send</>}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Message History</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-center text-muted-foreground py-4">Loading...</p> : messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.map(m => {
                const isSent = String(m.sender_id || m.sender) === String(currentUserId);
                const isUnread = !isSent && !m.is_read;
                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${isSent ? "bg-primary/10 ml-8" : isUnread ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 mr-8" : "bg-muted mr-8"}`}
                    onClick={() => isUnread && markRead(m.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {isSent ? `You → ${getAdminLabel(m.receiver_id || m.receiver)}` : `${getAdminLabel(m.sender_id || m.sender)} → You`}
                      </span>
                      <div className="flex items-center gap-1">
                        {isUnread && <Badge variant="destructive" className="text-xs py-0 h-4">New</Badge>}
                        {m.is_read ? <MailOpen className="h-3 w-3 text-muted-foreground" /> : <Mail className="h-3 w-3 text-primary" />}
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{m.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;
