import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AdminPageLayout from "@/components/layout/AdminPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Mail,
  Download,
  Eye,
  Edit,
  UserX,
  UserCheck,
  ChevronDown,
  ArrowUpDown,
  X,
  Users,
  BookOpen,
  DollarSign,
  School,
  Clock,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { handDrawnBorder } from "@/lib/admin-styles";
import { format } from "date-fns";

// Mock data
type UserRole = "parent" | "teacher" | "sponsor" | "admin";
type UserStatus = "active" | "pending" | "suspended";

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
  registeredAt: string;
  hasLoggedReading: boolean;
  hasPledged: boolean;
  relatedInfo: string;
  children?: string[];
  className?: string;
  pledges?: { child: string; amount: number }[];
  students?: number;
}

const mockUsers: MockUser[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", role: "parent", status: "active", lastActive: "2 hours ago", registeredAt: "2024-02-15", hasLoggedReading: true, hasPledged: false, relatedInfo: "2 children", children: ["Emma J.", "Lucas J."] },
  { id: "2", name: "Mrs. Anderson", email: "anderson@school.edu", role: "teacher", status: "active", lastActive: "1 hour ago", registeredAt: "2024-01-10", hasLoggedReading: true, hasPledged: false, relatedInfo: "Room 204", className: "Room 204", students: 24 },
  { id: "3", name: "John Smith", email: "john@example.com", role: "sponsor", status: "active", lastActive: "1 day ago", registeredAt: "2024-03-01", hasLoggedReading: false, hasPledged: true, relatedInfo: "$125 pledged", pledges: [{ child: "Emma J.", amount: 75 }, { child: "Olivia R.", amount: 50 }] },
  { id: "4", name: "Admin User", email: "admin@school.edu", role: "admin", status: "active", lastActive: "Just now", registeredAt: "2024-01-01", hasLoggedReading: false, hasPledged: false, relatedInfo: "Full access" },
  { id: "5", name: "Michael Chen", email: "mchen@example.com", role: "parent", status: "pending", lastActive: "Never", registeredAt: "2024-03-10", hasLoggedReading: false, hasPledged: false, relatedInfo: "1 child", children: ["Lily C."] },
  { id: "6", name: "Mr. Williams", email: "williams@school.edu", role: "teacher", status: "active", lastActive: "3 hours ago", registeredAt: "2024-01-15", hasLoggedReading: true, hasPledged: false, relatedInfo: "Room 108", className: "Room 108", students: 23 },
  { id: "7", name: "Emily Davis", email: "emily@example.com", role: "sponsor", status: "suspended", lastActive: "1 week ago", registeredAt: "2024-02-20", hasLoggedReading: false, hasPledged: true, relatedInfo: "$50 pledged", pledges: [{ child: "Noah P.", amount: 50 }] },
  { id: "8", name: "Jennifer Garcia", email: "jgarcia@example.com", role: "parent", status: "active", lastActive: "5 hours ago", registeredAt: "2024-02-01", hasLoggedReading: true, hasPledged: false, relatedInfo: "3 children", children: ["Sofia G.", "Diego G.", "Maria G."] },
  { id: "9", name: "Ms. Thompson", email: "thompson@school.edu", role: "teacher", status: "pending", lastActive: "Never", registeredAt: "2024-03-08", hasLoggedReading: false, hasPledged: false, relatedInfo: "Room 301", className: "Room 301", students: 0 },
  { id: "10", name: "Robert Wilson", email: "rwilson@corp.com", role: "sponsor", status: "active", lastActive: "2 days ago", registeredAt: "2024-02-28", hasLoggedReading: false, hasPledged: true, relatedInfo: "$200 pledged", pledges: [{ child: "Multiple", amount: 200 }] },
];

const mockActionHistory = [
  { action: "Logged in", date: "Mar 10, 2024, 2:30 PM" },
  { action: "Updated profile", date: "Mar 8, 2024, 10:15 AM" },
  { action: "Added child: Emma J.", date: "Feb 15, 2024, 3:45 PM" },
  { action: "Account created", date: "Feb 15, 2024, 3:30 PM" },
];

type SortField = "name" | "email" | "role" | "status" | "lastActive";
type SortOrder = "asc" | "desc";

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [participationFilter, setParticipationFilter] = useState<"all" | "logged" | "pledged">("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [detailUser, setDetailUser] = useState<MockUser | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUserRole, setNewUserRole] = useState<UserRole>("parent");

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    return mockUsers
      .filter((user) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!user.name.toLowerCase().includes(query) && !user.email.toLowerCase().includes(query)) {
            return false;
          }
        }
        if (roleFilter !== "all" && user.role !== roleFilter) return false;
        if (statusFilter !== "all" && user.status !== statusFilter) return false;
        if (participationFilter === "logged" && !user.hasLoggedReading) return false;
        if (participationFilter === "pledged" && !user.hasPledged) return false;
        return true;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const comparison = String(aVal).localeCompare(String(bVal));
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [searchQuery, roleFilter, statusFilter, participationFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleSelectUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      parent: "bg-brand-blue/10 text-brand-blue border-brand-blue/20",
      teacher: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      sponsor: "bg-brand-green/10 text-brand-green border-brand-green/20",
      admin: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    };
    return (
      <Badge variant="outline" className={cn("capitalize", styles[role])}>
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (status: UserStatus) => {
    const styles = {
      active: "bg-brand-green/10 text-brand-green border-brand-green/20",
      pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      suspended: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return (
      <Badge variant="outline" className={cn("capitalize", styles[status])}>
        {status}
      </Badge>
    );
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "parent": return <Users className="h-4 w-4" />;
      case "teacher": return <School className="h-4 w-4" />;
      case "sponsor": return <DollarSign className="h-4 w-4" />;
      case "admin": return <UserCheck className="h-4 w-4" />;
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    setParticipationFilter("all");
  };

  const hasActiveFilters = searchQuery || roleFilter !== "all" || statusFilter !== "all" || participationFilter !== "all";

  const headerActions = (
    <>
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system manually.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input placeholder="Smith" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="john@example.com" />
            </div>
            {newUserRole === "teacher" && (
              <div className="space-y-2">
                <Label>Classroom</Label>
                <Input placeholder="Room 204" />
              </div>
            )}
            {newUserRole === "parent" && (
              <div className="space-y-2">
                <Label>Children (comma-separated)</Label>
                <Input placeholder="Emma, Lucas" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Checkbox id="sendWelcome" defaultChecked />
              <Label htmlFor="sendWelcome" className="text-sm font-normal">
                Send welcome email with login instructions
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateOpen(false)}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <AdminPageLayout 
      title="User Management" 
      subtitle={`${filteredUsers.length} users ${hasActiveFilters ? "(filtered)" : ""}`}
      actions={headerActions}
    >
      {/* Filters */}
      <div className="bg-background-warm p-4 mb-6" style={handDrawnBorder}>
        <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as UserRole | "all")}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as UserStatus | "all")}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={participationFilter} onValueChange={(v) => setParticipationFilter(v as "all" | "logged" | "pledged")}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Participation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="logged">Has Logged Reading</SelectItem>
                  <SelectItem value="pledged">Has Pledged</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
        </div>
      </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-4 p-4 mb-4 bg-primary/10" style={handDrawnBorder}>
              <span className="text-sm font-medium">
                {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Send Email
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change Status <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Set Active
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserX className="h-4 w-4 mr-2" />
                      Suspend
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedUsers([])}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* User Table */}
          <div className="bg-background overflow-hidden" style={handDrawnBorder}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("name")}
                    >
                      Name
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("role")}
                    >
                      Role
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>Related</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30">
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        className="font-medium text-foreground hover:text-brand-blue hover:underline text-left"
                        onClick={() => setDetailUser(user)}
                      >
                        {user.name}
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.relatedInfo}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetailUser(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "active" ? (
                            <DropdownMenuItem className="text-destructive">
                              <UserX className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No users found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

      {/* User Detail Sheet */}
      <Sheet open={!!detailUser} onOpenChange={(open) => !open && setDetailUser(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detailUser && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center",
                    detailUser.role === "parent" ? "bg-primary/10 text-primary" :
                    detailUser.role === "teacher" ? "bg-purple-500/10 text-purple-600" :
                    detailUser.role === "sponsor" ? "bg-accent/10 text-accent" :
                    "bg-amber-500/10 text-amber-600"
                  )}>
                    {getRoleIcon(detailUser.role)}
                  </div>
                  <div>
                    <div className="text-lg">{detailUser.name}</div>
                    <div className="text-sm font-normal text-muted-foreground">{detailUser.email}</div>
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  User details and actions
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                <div className="flex gap-2">
                  {getRoleBadge(detailUser.role)}
                  {getStatusBadge(detailUser.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Registered</p>
                    <p className="font-medium">{format(new Date(detailUser.registeredAt), "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Active</p>
                    <p className="font-medium">{detailUser.lastActive}</p>
                  </div>
                </div>

                {/* Role-specific info */}
                {detailUser.role === "parent" && detailUser.children && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Children</p>
                    <div className="flex flex-wrap gap-2">
                      {detailUser.children.map((child) => (
                        <Badge key={child} variant="secondary">
                          {child}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {detailUser.role === "teacher" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Classroom</p>
                      <p className="font-medium">{detailUser.className}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="font-medium">{detailUser.students}</p>
                    </div>
                  </div>
                )}

                {detailUser.role === "sponsor" && detailUser.pledges && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Pledges</p>
                    <div className="space-y-2">
                      {detailUser.pledges.map((pledge, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span>{pledge.child}</span>
                          <span className="font-medium">${pledge.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Recent Activity</p>
                  <div className="space-y-2">
                    {mockActionHistory.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm py-1 border-b last:border-0">
                        <span>{item.action}</span>
                        <span className="text-muted-foreground">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {detailUser.status === "active" ? (
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <UserX className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-600">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminPageLayout>
  );
};

export default AdminUsersPage;
