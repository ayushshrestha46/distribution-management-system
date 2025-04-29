import { useState, useEffect } from "react";
import { useAllCustomersQuery } from "@/app/slices/adminApiSlice";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  UserX,
  Ban,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";

const DistributorCustomer = () => {
  const { data, isLoading, error, refetch } = useAllCustomersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [distributorFilter, setDistributorFilter] = useState("all");
  // "ban" or "unban"

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
    <div className="container mx-auto px-6 pt-6">

      <ScrollArea className="h-[calc(100vh-90px)]">
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

export default DistributorCustomer;
