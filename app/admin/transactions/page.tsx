import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, DollarSign, TrendingUp, CreditCard } from "lucide-react"

export default async function TransactionsPage() {
  const supabase = createServerClient()

  // Get transactions with user and film information
  const { data: transactions } = await supabase
    .from("transactions")
    .select(
      `
      *,
      users(full_name, email),
      films(title)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  // Calculate stats
  const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
  const completedTransactions = transactions?.filter((t) => t.status === "completed").length || 0
  const pendingTransactions = transactions?.filter((t) => t.status === "pending").length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Transaction Management</h1>
        <p className="text-gray-400">Monitor all platform transactions and revenue</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">All time revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completedTransactions}</div>
            <p className="text-xs text-gray-400">Successful transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingTransactions}</div>
            <p className="text-xs text-gray-400">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search transactions..." className="pl-10 bg-gray-800 border-gray-700 text-white" />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions ({transactions?.length || 0})</CardTitle>
          <CardDescription className="text-gray-400">Latest platform transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Transaction ID</TableHead>
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Film</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction) => (
                <TableRow key={transaction.id} className="border-gray-700">
                  <TableCell className="font-mono text-sm text-gray-300">{transaction.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{transaction.users?.full_name || "Unknown"}</p>
                      <p className="text-sm text-gray-400">{transaction.users?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{transaction.films?.title || "Unknown Film"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        transaction.transaction_type === "purchase"
                          ? "bg-blue-600 text-white border-blue-600"
                          : transaction.transaction_type === "rental"
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-purple-600 text-white border-purple-600"
                      }
                    >
                      {transaction.transaction_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    ${transaction.amount?.toFixed(2)} {transaction.currency}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.status === "completed" ? "default" : "secondary"}
                      className={
                        transaction.status === "completed"
                          ? "bg-green-600 text-white"
                          : transaction.status === "pending"
                            ? "bg-yellow-600 text-white"
                            : transaction.status === "failed"
                              ? "bg-red-600 text-white"
                              : "bg-gray-600 text-white"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
