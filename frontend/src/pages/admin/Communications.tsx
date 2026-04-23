import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Crown, Building2, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";
import { useBranches } from "@/hooks/use-branches";
import { motion, AnimatePresence } from "framer-motion";

const Communications = () => {
  const { user } = useAuth();
  const { isSuperAdmin } = useUserRole();
  const branches = useBranches();
  const { toast } = useToast();

  const [comms, setComms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [sending, setSending] = useState(false);

  const fetchComms = async () => {
    setLoading(true);
    const response = await apiService.getCommunications();
    if (response.data) {
      const data = response.data as any;
      setComms(data.results || data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchComms(); }, []);

  const handleSend = async () => {
    if (!message.trim()) {
      toast({ title: "Message required", variant: "destructive" });
      return;
    }
    setSending(true);
    const payload: any = { message, is_bishop_broadcast: isBroadcast };
    if (!isBroadcast && selectedBranchId) payload.branch_id = selectedBranchId;

    const response = await apiService.createCommunication(payload);
    setSending(false);

    if (response.error) {
      toast({ title: "Failed to send", description: response.error, variant: "destructive" });
      return;
    }
    toast({ title: isBroadcast ? "Bishop Broadcast Sent!" : "Message Sent!", description: "Your message has been published." });
    setMessage("");
    setIsBroadcast(false);
    setSelectedBranchId("");
    setDialogOpen(false);
    fetchComms();
  };

  const handleDelete = async (id: string) => {
    await apiService.deleteCommunication(id);
    toast({ title: "Message deleted" });
    fetchComms();
  };

  // Split into bishop broadcasts and branch comms
  const broadcasts = comms.filter(c => c.is_bishop_broadcast);
  const branchComms = comms.filter(c => !c.is_bishop_broadcast);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Communications</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchComms} size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Send className="h-4 w-4 mr-2" /> New Message
          </Button>
        </div>
      </div>

      {/* Bishop Broadcasts — visible to all branch admins/secretaries */}
      {broadcasts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-foreground">From the Bishop</h3>
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 border">Broadcast</Badge>
          </div>
          <AnimatePresence>
            {broadcasts.map((comm, i) => (
              <motion.div
                key={comm.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-900/10 shadow-md">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Crown className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Bishop's Message</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comm.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{comm.message}</p>
                        </div>
                      </div>
                      {isSuperAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(comm.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Branch Communications */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-foreground">Branch Messages</h3>
          <Badge variant="secondary">{branchComms.length}</Badge>
        </div>

        {loading ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading communications...</p>
            </CardContent>
          </Card>
        ) : branchComms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No branch messages yet.</p>
              <Button onClick={() => setDialogOpen(true)} variant="outline" className="mt-4">
                Send the first message
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {branchComms.map((comm, i) => (
              <motion.div
                key={comm.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {comm.branch_name && (
                              <Badge variant="outline" className="text-xs">{comm.branch_name}</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {comm.created_by_email && `by ${comm.created_by_email} · `}
                              {new Date(comm.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{comm.message}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(comm.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* New Message Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              New Communication
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {/* Bishop Broadcast Toggle — only for super admin */}
            {isSuperAdmin && (
              <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${isBroadcast ? "border-amber-300 bg-amber-50 dark:bg-amber-900/10" : "border-muted"}`}>
                <div className="flex items-center gap-3">
                  <Crown className={`h-5 w-5 ${isBroadcast ? "text-amber-600" : "text-muted-foreground"}`} />
                  <div>
                    <p className="font-semibold text-sm">Bishop Broadcast</p>
                    <p className="text-xs text-muted-foreground">Visible to ALL branch admins & secretaries</p>
                  </div>
                </div>
                <Switch checked={isBroadcast} onCheckedChange={setIsBroadcast} />
              </div>
            )}

            {/* Branch selector — only shown if not a broadcast */}
            {isSuperAdmin && !isBroadcast && (
              <div>
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Branch</Label>
                <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select branch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {isBroadcast ? "Bishop's Message" : "Message"}
              </Label>
              <Textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                placeholder={isBroadcast ? "Write your message to all branches..." : "Write your branch message..."}
                className="mt-1.5 rounded-xl border-2"
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={sending || !message.trim()}
              className={`w-full font-bold ${isBroadcast ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isBroadcast ? <Crown className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  {isBroadcast ? "Send Bishop Broadcast" : "Send Message"}
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Communications;
