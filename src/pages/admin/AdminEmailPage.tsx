import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Send,
  Clock,
  Edit,
  Trash2,
  Copy,
  Eye,
  Calendar as CalendarIcon,
  Users,
  Filter,
  Variable,
  CheckCircle,
  AlertTriangle,
  Mail,
  XCircle,
  History,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useEmailTemplates,
  useCreateEmailTemplate,
  useUpdateEmailTemplate,
  useDeleteEmailTemplate,
  type EmailTemplate,
} from "@/hooks/useEmailTemplates";
import { useEmailRecipientCounts } from "@/hooks/useEmailRecipientCounts";
import { useLogEmails, useEmailLogs } from "@/hooks/useEmailLogs";

// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Available variables for email templates
const availableVariables = [
  { key: "{{sponsor_name}}", description: "Sponsor's full name" },
  { key: "{{sponsor_first_name}}", description: "Sponsor's first name" },
  { key: "{{student_name}}", description: "Student's name" },
  { key: "{{student_first_name}}", description: "Student's first name" },
  { key: "{{pledge_amount}}", description: "Pledge amount (e.g., $50 or $0.05/min)" },
  { key: "{{total_owed}}", description: "Total amount owed" },
  { key: "{{minutes_read}}", description: "Total minutes read" },
  { key: "{{goal_minutes}}", description: "Reading goal in minutes" },
  { key: "{{progress_percent}}", description: "Progress percentage" },
  { key: "{{payment_link}}", description: "Link to payment page" },
  { key: "{{event_name}}", description: "Event name" },
  { key: "{{school_name}}", description: "School name" },
  { key: "{{days_remaining}}", description: "Days until event ends" },
];

// Recipient filter options
const recipientFilters = [
  { id: "all_sponsors", label: "All Sponsors", description: "Everyone who made a pledge" },
  { id: "unpaid_sponsors", label: "Unpaid Sponsors", description: "Sponsors with outstanding payments" },
  { id: "overdue_sponsors", label: "Overdue (7+ days)", description: "Payments overdue by 7+ days" },
  { id: "check_sponsors", label: "Check Payers", description: "Sponsors paying by check" },
  { id: "all_parents", label: "All Parents", description: "All registered parents" },
  { id: "all_teachers", label: "All Teachers", description: "All teachers in the event" },
  { id: "inactive_students", label: "Inactive Students' Parents", description: "Parents of students who haven't logged reading in 7+ days" },
];

const AdminEmailPage = () => {
  // Data queries
  const { data: templates = [], isLoading: templatesLoading } = useEmailTemplates();
  const { data: recipientCounts, isLoading: countsLoading } = useEmailRecipientCounts();
  const { data: emailLogs = [], isLoading: logsLoading } = useEmailLogs();
  
  // Mutations
  const createTemplate = useCreateEmailTemplate();
  const updateTemplate = useUpdateEmailTemplate();
  const deleteTemplate = useDeleteEmailTemplate();
  const logEmails = useLogEmails();

  // UI state
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  // Editor state
  const [templateName, setTemplateName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientType, setRecipientType] = useState<"filter" | "manual">("filter");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();

  const openNewTemplate = () => {
    setEditingTemplate(null);
    setTemplateName("");
    setSubject("");
    setBody("");
    setRecipientType("filter");
    setSelectedFilter("");
    setSelectedRecipients([]);
    setShowEditor(true);
  };

  const openEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setSubject(template.subject);
    setBody(template.body);
    setRecipientType("filter");
    setSelectedFilter(template.recipient_filter);
    setSelectedRecipients([]);
    setShowEditor(true);
  };

  const insertVariable = (variable: string) => {
    setBody((prev) => prev + variable);
  };

  const insertVariableInSubject = (variable: string) => {
    setSubject((prev) => prev + variable);
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !subject || !body) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingTemplate) {
        await updateTemplate.mutateAsync({
          id: editingTemplate.id,
          name: templateName,
          subject,
          body,
          recipient_filter: selectedFilter || "all_sponsors",
        });
        toast.success("Template updated!");
      } else {
        await createTemplate.mutateAsync({
          name: templateName,
          subject,
          body,
          recipient_filter: selectedFilter || "all_sponsors",
          status: "draft",
        });
        toast.success("Template saved!");
      }
      setShowEditor(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save template");
    }
  };

  const handleSendNow = async () => {
    if (!templateName || !subject || !body) {
      toast.error("Please fill in all required fields");
      return;
    }

    const count = getRecipientCount();
    if (count === 0) {
      toast.error("No recipients selected");
      return;
    }

    try {
      // First save/update the template
      let templateId = editingTemplate?.id;
      
      if (editingTemplate) {
        await updateTemplate.mutateAsync({
          id: editingTemplate.id,
          name: templateName,
          subject,
          body,
          recipient_filter: selectedFilter || "all_sponsors",
          status: "sent",
        });
      } else {
        const newTemplate = await createTemplate.mutateAsync({
          name: templateName,
          subject,
          body,
          recipient_filter: selectedFilter || "all_sponsors",
          status: "sent",
        });
        templateId = newTemplate.id;
      }

      // Log the emails (without actually sending - that comes later with Resend)
      // For now, we'll create a single log entry as a placeholder
      await logEmails.mutateAsync([{
        template_id: templateId,
        recipient_email: "placeholder@example.com",
        recipient_name: "Batch Send",
        recipient_type: selectedFilter,
        subject: subject,
        body: body,
        status: "pending",
      }]);

      toast.success(`Email queued for ${count} recipients! (Email sending coming soon)`);
      setShowEditor(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send emails");
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      if (editingTemplate) {
        await updateTemplate.mutateAsync({
          id: editingTemplate.id,
          name: templateName,
          subject,
          body,
          recipient_filter: selectedFilter || "all_sponsors",
          status: "scheduled",
          scheduled_for: scheduleDate.toISOString(),
        });
      } else {
        await createTemplate.mutateAsync({
          name: templateName,
          subject,
          body,
          recipient_filter: selectedFilter || "all_sponsors",
          status: "scheduled",
          scheduled_for: scheduleDate.toISOString(),
        });
      }

      toast.success(`Email scheduled for ${format(scheduleDate, "PPP")}`);
      setShowScheduler(false);
      setShowEditor(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule email");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate.mutateAsync(id);
      toast.success("Template deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete template");
    }
  };

  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    try {
      await createTemplate.mutateAsync({
        name: `${template.name} (Copy)`,
        subject: template.subject,
        body: template.body,
        recipient_filter: template.recipient_filter,
        status: "draft",
      });
      toast.success("Template duplicated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to duplicate template");
    }
  };

  const getRecipientCount = () => {
    if (recipientType === "manual") {
      return selectedRecipients.length;
    }
    if (!recipientCounts || !selectedFilter) return 0;
    return recipientCounts[selectedFilter as keyof typeof recipientCounts] || 0;
  };

  const previewBody = body
    .replace(/\{\{sponsor_name\}\}/g, "Betty Smith")
    .replace(/\{\{sponsor_first_name\}\}/g, "Betty")
    .replace(/\{\{student_name\}\}/g, "Emma Johnson")
    .replace(/\{\{student_first_name\}\}/g, "Emma")
    .replace(/\{\{pledge_amount\}\}/g, "$0.05/minute")
    .replace(/\{\{total_owed\}\}/g, "$17.35")
    .replace(/\{\{minutes_read\}\}/g, "347")
    .replace(/\{\{goal_minutes\}\}/g, "500")
    .replace(/\{\{progress_percent\}\}/g, "69")
    .replace(/\{\{payment_link\}\}/g, "https://readathon.school/pay/abc123")
    .replace(/\{\{event_name\}\}/g, "Spring Read-a-thon 2024")
    .replace(/\{\{school_name\}\}/g, "Lincoln Elementary")
    .replace(/\{\{days_remaining\}\}/g, "12");

  const previewSubject = subject
    .replace(/\{\{sponsor_first_name\}\}/g, "Betty")
    .replace(/\{\{student_first_name\}\}/g, "Emma")
    .replace(/\{\{student_name\}\}/g, "Emma Johnson")
    .replace(/\{\{days_remaining\}\}/g, "12")
    .replace(/\{\{event_name\}\}/g, "Spring Read-a-thon 2024");

  const getStatusBadge = (status: EmailTemplate["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "scheduled":
        return <Badge variant="info">Scheduled</Badge>;
      case "sent":
        return <Badge variant="success">Sent</Badge>;
    }
  };

  const TemplateCard = ({ template }: { template: EmailTemplate }) => (
    <div
      className="bg-background p-4 hover:shadow-md transition-shadow"
      style={handDrawnBorder}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground">{template.name}</h3>
            {getStatusBadge(template.status)}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {template.subject}
          </p>
          {template.scheduled_for && (
            <p className="text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3 inline mr-1" />
              Scheduled for {format(new Date(template.scheduled_for), "PPP")}
            </p>
          )}
          {template.status === "sent" && (
            <p className="text-xs text-muted-foreground mt-1">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Sent {format(new Date(template.updated_at), "PPP")}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditTemplate(template)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDuplicateTemplate(template)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          {template.status === "draft" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDeleteTemplate(template.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const TemplateListSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-background p-4" style={handDrawnBorder}>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <AdminLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="relative inline-block mb-2">
              <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground relative">
                <span className="relative">
                  Email Templates
                  <span 
                    className="absolute inset-0 -skew-y-1 bg-accent/30 -z-10 transform -rotate-[0.5deg]"
                    style={{
                      top: '50%',
                      height: '50%',
                      left: '-2%',
                      right: '-2%',
                      borderRadius: '4px 8px 4px 6px',
                    }}
                    aria-hidden="true"
                  />
                </span>
              </h1>
            </div>
            <p className="text-muted-foreground">
              Create, schedule, and send emails to sponsors, parents, and teachers
            </p>
          </div>
          <Button onClick={openNewTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>

        {/* Templates List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-1">
              <History className="h-3.5 w-3.5" />
              Email Logs
            </TabsTrigger>
          </TabsList>

          {templatesLoading ? (
            <TemplateListSkeleton />
          ) : (
            <>
              <TabsContent value="all" className="space-y-4">
                {templates.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No templates yet. Create your first email template!</p>
                  </div>
                ) : (
                  templates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="drafts" className="space-y-4">
                {templates.filter((t) => t.status === "draft").length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No draft templates</p>
                  </div>
                ) : (
                  templates.filter((t) => t.status === "draft").map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="scheduled" className="space-y-4">
                {templates.filter((t) => t.status === "scheduled").length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No scheduled emails</p>
                  </div>
                ) : (
                  templates.filter((t) => t.status === "scheduled").map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="sent" className="space-y-4">
                {templates.filter((t) => t.status === "sent").length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No sent emails yet</p>
                  </div>
                ) : (
                  templates.filter((t) => t.status === "sent").map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="logs" className="space-y-4">
                {logsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : emailLogs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No emails sent yet</p>
                    <p className="text-sm mt-1">Email logs will appear here after you send emails</p>
                  </div>
                ) : (
                  <div className="bg-background rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Sent At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emailLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{log.recipient_name || "—"}</p>
                                <p className="text-sm text-muted-foreground">{log.recipient_email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {log.subject}
                            </TableCell>
                            <TableCell>
                              {log.status === "sent" && (
                                <Badge variant="success" className="flex items-center gap-1 w-fit">
                                  <CheckCircle className="h-3 w-3" />
                                  Sent
                                </Badge>
                              )}
                              {log.status === "pending" && (
                                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                  <Clock className="h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                              {log.status === "failed" && (
                                <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                  <XCircle className="h-3 w-3" />
                                  Failed
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {log.sent_at 
                                ? format(new Date(log.sent_at), "PPp")
                                : format(new Date(log.created_at), "PPp")
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Email Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "New Email Template"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid lg:grid-cols-3 gap-6 py-4">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-4">
              <FormField label="Template Name" htmlFor="templateName" required>
                <Input
                  id="templateName"
                  placeholder="e.g., Payment Reminder"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </FormField>

              <FormField label="Subject Line" htmlFor="subject" required>
                <div className="flex gap-2">
                  <Input
                    id="subject"
                    placeholder="e.g., Reminder: Your pledge for {{student_first_name}}"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="flex-1"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Variable className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64" align="end">
                      <p className="text-sm font-medium mb-2">Insert Variable</p>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {availableVariables.slice(0, 6).map((v) => (
                          <button
                            key={v.key}
                            onClick={() => insertVariableInSubject(v.key)}
                            className="w-full text-left p-2 text-sm hover:bg-muted rounded"
                          >
                            <code className="text-primary">{v.key}</code>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </FormField>

              <FormField label="Email Body" htmlFor="body" required>
                <Textarea
                  id="body"
                  placeholder="Write your email content here. Use variables like {{sponsor_first_name}} to personalize."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </FormField>

              {/* Recipients */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Recipients</Label>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={recipientType === "filter"}
                      onChange={() => setRecipientType("filter")}
                      className="accent-primary"
                    />
                    <span className="text-sm">Use Filter</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={recipientType === "manual"}
                      onChange={() => setRecipientType("manual")}
                      className="accent-primary"
                      disabled
                    />
                    <span className="text-sm text-muted-foreground">Select Manually (coming soon)</span>
                  </label>
                </div>

                {recipientType === "filter" && (
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select recipient group..." />
                    </SelectTrigger>
                    <SelectContent>
                      {recipientFilters.map((filter) => (
                        <SelectItem key={filter.id} value={filter.id}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <p>{filter.label}</p>
                              <p className="text-xs text-muted-foreground">{filter.description}</p>
                            </div>
                            {recipientCounts && !countsLoading && (
                              <Badge variant="secondary" className="ml-2">
                                {recipientCounts[filter.id as keyof typeof recipientCounts] || 0}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {selectedFilter && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {countsLoading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      <>
                        {getRecipientCount()} recipient{getRecipientCount() !== 1 ? "s" : ""} selected
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Variable Sidebar */}
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Variable className="h-4 w-4" />
                  Available Variables
                </h3>
                <div className="space-y-2">
                  {availableVariables.map((variable) => (
                    <button
                      key={variable.key}
                      onClick={() => insertVariable(variable.key)}
                      className="w-full text-left p-2 text-xs hover:bg-background rounded transition-colors"
                    >
                      <code className="text-primary font-medium">{variable.key}</code>
                      <p className="text-muted-foreground mt-0.5">{variable.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPreview(true)}
                disabled={!subject || !body}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Email
              </Button>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              Cancel
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleSaveTemplate} 
              disabled={createTemplate.isPending || updateTemplate.isPending}
            >
              {(createTemplate.isPending || updateTemplate.isPending) ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowScheduler(true)}
              disabled={!templateName || !subject || !body || getRecipientCount() === 0}
            >
              <Clock className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button
              onClick={handleSendNow}
              disabled={!templateName || !subject || !body || getRecipientCount() === 0 || logEmails.isPending}
            >
              <Send className="h-4 w-4 mr-2" />
              {logEmails.isPending ? "Sending..." : `Send Now (${getRecipientCount()})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              This is how your email will look with sample data
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-3 border-b">
                <p className="text-sm">
                  <strong>To:</strong> betty@example.com
                </p>
                <p className="text-sm">
                  <strong>Subject:</strong> {previewSubject}
                </p>
              </div>
              <div className="p-4 bg-background">
                <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
                  {previewBody}
                </pre>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={showScheduler} onOpenChange={setShowScheduler}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Email</DialogTitle>
            <DialogDescription>
              Choose when to send this email to {getRecipientCount()} recipients
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label className="mb-2 block">Send Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduleDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduleDate}
                  onSelect={setScheduleDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduler(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSchedule} 
              disabled={!scheduleDate || createTemplate.isPending || updateTemplate.isPending}
            >
              <Clock className="h-4 w-4 mr-2" />
              {(createTemplate.isPending || updateTemplate.isPending) ? "Scheduling..." : "Schedule Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEmailPage;
