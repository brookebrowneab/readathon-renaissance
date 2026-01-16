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
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  recipientFilter: string;
  status: "draft" | "scheduled" | "sent";
  scheduledFor?: Date;
  sentAt?: Date;
  recipientCount?: number;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Payment Reminder",
    subject: "Reminder: Your Read-a-thon Pledge for {{student_first_name}}",
    body: "Hi {{sponsor_first_name}},\n\nThank you for sponsoring {{student_name}} in our Read-a-thon! They've read {{minutes_read}} minutes so far.\n\nYour pledge of {{pledge_amount}} totals {{total_owed}}.\n\nPay now: {{payment_link}}\n\nThank you for supporting literacy!\n\n- {{school_name}} PTA",
    recipientFilter: "unpaid_sponsors",
    status: "draft",
  },
  {
    id: "2",
    name: "Event Ending Soon",
    subject: "Only {{days_remaining}} Days Left! {{event_name}}",
    body: "Hi {{sponsor_first_name}},\n\n{{student_first_name}} is doing great! They've reached {{progress_percent}}% of their goal.\n\nThe event ends in {{days_remaining}} days. Payment reminders will be sent after the event concludes.\n\nThank you for your support!\n\n- {{school_name}}",
    recipientFilter: "all_sponsors",
    status: "scheduled",
    scheduledFor: new Date("2025-01-10"),
    recipientCount: 156,
  },
  {
    id: "3",
    name: "Thank You - Payment Received",
    subject: "Thank You for Your Support! 📚",
    body: "Hi {{sponsor_first_name}},\n\nThank you for your generous pledge of {{total_owed}} to support {{student_name}}!\n\nYour contribution helps fund literacy programs at {{school_name}}.\n\nWith gratitude,\n{{school_name}} PTA",
    recipientFilter: "all_sponsors",
    status: "sent",
    sentAt: new Date("2024-12-20"),
    recipientCount: 89,
  },
];

interface ManualRecipient {
  id: string;
  name: string;
  email: string;
  type: "sponsor" | "parent" | "teacher";
}

const mockRecipients: ManualRecipient[] = [
  { id: "1", name: "Betty Smith", email: "betty@example.com", type: "sponsor" },
  { id: "2", name: "John Davis", email: "john@example.com", type: "sponsor" },
  { id: "3", name: "Sarah Johnson", email: "sarah@example.com", type: "parent" },
  { id: "4", name: "Mike Thompson", email: "mike@example.com", type: "sponsor" },
  { id: "5", name: "Lisa Brown", email: "lisa@example.com", type: "parent" },
  { id: "6", name: "Ms. Williams", email: "williams@school.edu", type: "teacher" },
];

const AdminEmailPage = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
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
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

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
    setSelectedFilter(template.recipientFilter);
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

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);

    toast.success(editingTemplate ? "Template updated!" : "Template saved!");
    setShowEditor(false);
  };

  const handleSendNow = async () => {
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    toast.success("Emails sent successfully!");
    setShowEditor(false);
  };

  const handleSchedule = async () => {
    if (!scheduleDate) {
      toast.error("Please select a date");
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);

    toast.success(`Email scheduled for ${format(scheduleDate, "PPP")}`);
    setShowScheduler(false);
    setShowEditor(false);
  };

  const getRecipientCount = () => {
    if (recipientType === "manual") {
      return selectedRecipients.length;
    }
    // Mock counts based on filter
    const counts: Record<string, number> = {
      all_sponsors: 156,
      unpaid_sponsors: 45,
      overdue_sponsors: 12,
      check_sponsors: 8,
      all_parents: 147,
      all_teachers: 12,
      inactive_students: 23,
    };
    return counts[selectedFilter] || 0;
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
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
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
                    {template.scheduledFor && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Scheduled for {format(template.scheduledFor, "PPP")} • {template.recipientCount} recipients
                      </p>
                    )}
                    {template.sentAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        Sent {format(template.sentAt, "PPP")} • {template.recipientCount} recipients
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
                      onClick={() => {
                        toast.success("Template duplicated!");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {template.status === "draft" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          toast.success("Template deleted");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="drafts">
            {templates.filter((t) => t.status === "draft").map((template) => (
              <div key={template.id} className="bg-background p-4" style={handDrawnBorder}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.subject}</p>
                  </div>
                  <Button size="sm" onClick={() => openEditTemplate(template)}>
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="scheduled">
            {templates.filter((t) => t.status === "scheduled").map((template) => (
              <div key={template.id} className="bg-background p-4" style={handDrawnBorder}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Scheduled for {template.scheduledFor && format(template.scheduledFor, "PPP")}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Cancel</Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="sent">
            {templates.filter((t) => t.status === "sent").map((template) => (
              <div key={template.id} className="bg-background p-4" style={handDrawnBorder}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Sent {template.sentAt && format(template.sentAt, "PPP")} to {template.recipientCount} recipients
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => openEditTemplate(template)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
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
                    />
                    <span className="text-sm">Select Manually</span>
                  </label>
                </div>

                {recipientType === "filter" ? (
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select recipient group..." />
                    </SelectTrigger>
                    <SelectContent>
                      {recipientFilters.map((filter) => (
                        <SelectItem key={filter.id} value={filter.id}>
                          <div>
                            <p>{filter.label}</p>
                            <p className="text-xs text-muted-foreground">{filter.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                    {mockRecipients.map((recipient) => (
                      <label
                        key={recipient.id}
                        className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedRecipients.includes(recipient.id)}
                          onCheckedChange={(checked) => {
                            setSelectedRecipients((prev) =>
                              checked
                                ? [...prev, recipient.id]
                                : prev.filter((id) => id !== recipient.id)
                            );
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{recipient.name}</p>
                          <p className="text-xs text-muted-foreground">{recipient.email}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {recipient.type}
                        </Badge>
                      </label>
                    ))}
                  </div>
                )}

                {(selectedFilter || selectedRecipients.length > 0) && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {getRecipientCount()} recipient{getRecipientCount() !== 1 ? "s" : ""} selected
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
            <Button variant="secondary" onClick={handleSaveTemplate} loading={isSaving}>
              Save as Draft
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
              loading={isSending}
              disabled={!templateName || !subject || !body || getRecipientCount() === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Now ({getRecipientCount()})
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
            <Button onClick={handleSchedule} loading={isSaving} disabled={!scheduleDate}>
              <Clock className="h-4 w-4 mr-2" />
              Schedule Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEmailPage;
