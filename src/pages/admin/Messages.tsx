import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Mail, MailOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/use-user-role";

const Messages = () => {
  const { isSuperAdmin } = useUserRole();
  const [messages, setMessages] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // Fetch other admins (branch_admin or super_admin)
      const { data: roles } = await supabase.from("user_roles").select("user_id, role, branches(branch_name)").neq("user_id", user.id);
      if (roles) setAdmins(roles);

      // Fetch messages
      const { data: msgs } = await supabase.from("private_messages").select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      if (msgs) setMessages(msgs);
      setLoading(false);
    };
    init();
  }, []);

  const handleSend = async () => {
    if (!message.trim() || !receiverId) { toast({ title: "Select recipient and type message", variant: "destructive" }); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("private_messages").insert({ sender_id: user.id, receiver_id: receiverId, message });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Message sent" }); setMessage("");

    // Refresh
    const { data: msgs } = await supabase.from("private_messages").select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (msgs) setMessages(msgs);
  };

  const markRead = async (id: string) => {
    await supabase.from("private_messages").update({ is_read: true }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const getAdminLabel = (userId: string) => {
    const admin = admins.find(a => a.user_id === userId);
    if (!admin) return userId.slice(0, 8) + "...";
    return `${admin.role === "super_admin" ? "Bishop" : "Pastor"} ${admin.branches?.branch_name ? `(${admin.branches.branch_name})` : ""}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Private Messages</h2>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" />Send Message</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>To</Label>
            <Select value={receiverId} onValueChange={setReceiverId}>
              <SelectTrigger><SelectValue placeholder="Select recipient" /></SelectTrigger>
              <SelectContent>
                {admins.map(a => (
                  <SelectItem key={a.user_id} value={a.user_id}>
                    {a.role === "super_admin" ? "Bishop (Super Admin)" : `Pastor${a.branches?.branch_name ? ` - ${a.branches.branch_name}` : ""}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Message</Label><Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your private message..." rows={3} /></div>
          <Button onClick={handleSend} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Send className="h-4 w-4 mr-2" />Send</Button>
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
                const isSent = m.sender_id === currentUserId;
                return (
                  <div key={m.id} className={`p-3 rounded-lg ${isSent ? "bg-primary/10 ml-8" : "bg-muted mr-8"}`}
                    onClick={() => !isSent && !m.is_read && markRead(m.id)}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {isSent ? `You → ${getAdminLabel(m.receiver_id)}` : `${getAdminLabel(m.sender_id)} → You`}
                      </span>
                      <div className="flex items-center gap-1">
                        {!isSent && !m.is_read && <Badge variant="destructive" className="text-xs">New</Badge>}
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
