import { useState, useEffect } from "react";
import {
  useAllCustomersQuery,
  useBanMutation,
} from "@/app/slices/adminApiSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Users,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
  RefreshCw,
  UserX,
  Ban,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { AddCustomer } from "./AddCustomer";

const AdminCustomers = () => {
  const { data, isLoading, error, refetch } = useAllCustomersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [distributorFilter, setDistributorFilter] = useState("all");
  const [userToConfirm, setUserToConfirm] = useState(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banAction, setBanAction] = useState("ban"); // "ban" or "unban"

  const [banUser] = useBanMutation();

  // Initialize bannedUsers state from API data
  useEffect(() => {
    if (data?.users) {
      const bannedUsersMap = {};
      data.users.forEach((user) => {
        if (user.isBanned) {
          bannedUsersMap[user._id] = true;
        }
      });
    }
  }, [data]);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Handle banning a user
  const handleBanClick = (userId, isBanned) => {
    if (!isBanned) {
      // Show confirmation dialog for banning
      setUserToConfirm(userId);
      setBanAction("ban");
      setShowBanDialog(true);
    } else {
      // Show confirmation dialog for unbanning
      setUserToConfirm(userId);
      setBanAction("unban");
      setShowBanDialog(true);
    }
  };

  const confirmAction = async () => {
    try {
      let res;

      if (banAction === "ban") {
        res = await banUser(userToConfirm).unwrap();
      } else {
        res = await banUser(userToConfirm).unwrap();
      }

      if (res.success) {
        toast.success(
          res.message ||
            `User successfully ${banAction === "ban" ? "banned" : "unbanned"}`
        );
        setShowBanDialog(false);
        setUserToConfirm(null);
        refetch(); // Refresh the data to get updated ban status
      } else {
        toast.error(res.message || "Action failed");
      }
    } catch (err) {
      toast.error(
        `Failed to ${banAction} user: ${err.message || "Unknown error"}`
      );
    }
  };

  const cancelAction = () => {
    setShowBanDialog(false);
    setUserToConfirm(null);
  };

  // Filter users based on search term and filters
  const filteredUsers = data?.users?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && user.isVerified) ||
      (statusFilter === "unverified" && !user.isVerified);

    const matchesDistributor =
      distributorFilter === "all" ||
      (distributorFilter === "allocated" && user.distributor) ||
      (distributorFilter === "unassigned" && !user.distributor);

    return matchesSearch && matchesStatus && matchesDistributor;
  });

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading customers...</p>
          <p className="text-sm text-muted-foreground">
            Gathering all customer information
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <Card className="w-full max-w-2xl border-destructive/50">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Error Loading Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground">
              There was a problem loading the customer data. This could be due
              to network issues or server problems.
            </p>
            <div className="flex gap-3">
              <Button onClick={refetch} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
              <Button variant="outline">Contact Support</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 mt-16 px-8">
      {/* Ban/Unban Confirmation Dialog */}
      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={`flex items-center gap-2 ${
                banAction === "ban" ? "text-destructive" : ""
              }`}
            >
              {banAction === "ban" ? (
                <>
                  <Ban className="h-5 w-5" />
                  Ban User
                </>
              ) : (
                <>
                  <UserX className="h-5 w-5" />
                  Unban User
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {banAction === "ban"
                ? "Are you sure you want to ban this user? They will no longer be able to access the platform. This action can be reversed later."
                : "Are you sure you want to unban this user? This will restore their access to the platform."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelAction}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                banAction === "ban"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {banAction === "ban" ? "Ban User" : "Unban User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Customers
          </h1>
          <p className="text-muted-foreground">
            Manage {data?.users?.length || 0} customer accounts and information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {/* <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button> */}

          <AddCustomer refetch={refetch}/>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.users?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Verified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.users?.filter((user) => user.isVerified).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-amber-500" />
              Unverified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.users?.filter((user) => !user.isVerified).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Ban className="h-4 w-4 text-red-500" />
              Banned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.users?.filter((user) => user.isBanned).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>
      <ScrollArea className="h-[calc(100vh-330px)]">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name, email or phone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Status
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "all"}
                  onCheckedChange={() => setStatusFilter("all")}
                >
                  All Statuses
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "verified"}
                  onCheckedChange={() => setStatusFilter("verified")}
                >
                  Verified
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "unverified"}
                  onCheckedChange={() => setStatusFilter("unverified")}
                >
                  Unverified
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Distributor
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuCheckboxItem
                  checked={distributorFilter === "all"}
                  onCheckedChange={() => setDistributorFilter("all")}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={distributorFilter === "allocated"}
                  onCheckedChange={() => setDistributorFilter("allocated")}
                >
                  Allocated
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={distributorFilter === "unassigned"}
                  onCheckedChange={() => setDistributorFilter("unassigned")}
                >
                  Unassigned
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Customers Table */}
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="bg-muted/50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Customer List</CardTitle>
                <CardDescription>
                  Showing {filteredUsers?.length || 0} of{" "}
                  {data?.users?.length || 0} customers
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px]">Distributor</TableHead>
                  <TableHead className="w-[120px]">Joined</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="border">
                            <AvatarImage
                              src={user.avatar?.url}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <ShoppingBag size={14} className="mr-1" />{" "}
                              {user.role}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center text-sm">
                                  <Mail
                                    size={14}
                                    className="mr-1 flex-shrink-0"
                                  />
                                  <span className="truncate max-w-[180px]">
                                    {user.email}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>{user.email}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <div className="flex items-center text-sm">
                            <Phone size={14} className="mr-1 flex-shrink-0" />
                            {user.phone}
                          </div>
                          {user.address && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin
                                      size={14}
                                      className="mr-1 flex-shrink-0"
                                    />
                                    <span className="truncate max-w-[180px]">
                                      {user.address}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>{user.address}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                          >
                            <CheckCircle size={14} />
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
                          >
                            <XCircle size={14} />
                            Unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.distributor ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge
                                  variant="secondary"
                                  className="truncate max-w-[100px]"
                                >
                                  {user.distributor.name}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                Allocated to {user.distributor.name}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center whitespace-nowrap">
                                <Calendar
                                  size={14}
                                  className="mr-1 flex-shrink-0"
                                />
                                <span>{formatDate(user.createdAt)}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              Joined on{" "}
                              {new Date(user.createdAt).toLocaleString()}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={
                                    user.isBanned ? "outline" : "destructive"
                                  }
                                  size="sm"
                                  className="h-8 px-2 flex items-center gap-1"
                                  onClick={() =>
                                    handleBanClick(user._id, user.isBanned)
                                  }
                                >
                                  {user.isBanned ? (
                                    <>
                                      <UserX className="h-4 w-4" />
                                      Unban
                                    </>
                                  ) : (
                                    <>
                                      <Ban className="h-4 w-4" />
                                      Ban
                                    </>
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {user.isBanned
                                  ? "Remove ban from this user"
                                  : "Ban this user"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {user.isBanned && (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200"
                            >
                              <UserX className="h-3 w-3 mr-1" />
                              Banned
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                        <Users
                          size={48}
                          strokeWidth={1}
                          className="opacity-50"
                        />
                        <p className="text-lg font-medium">
                          No customers found
                        </p>
                        {searchTerm ? (
                          <>
                            <p className="text-sm">
                              No results for "{searchTerm}"
                            </p>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                                setDistributorFilter("all");
                              }}
                              className="mt-2"
                            >
                              Clear filters
                            </Button>
                          </>
                        ) : (
                          <p className="text-sm">
                            There are no customers matching your current filters
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
};

export default AdminCustomers;
