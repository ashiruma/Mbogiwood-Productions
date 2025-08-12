import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Receipt, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export async function PaymentHistory() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's transaction history
  const { data: transactions } = await supabase
    .from("transactions")
    .select(
      `
      *,
      films(title, poster_url)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Receipt className="mr-2 h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription className="text-gray-400">Your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-8">No transactions yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Receipt className="mr-2 h-5 w-5" />
          Payment History
        </CardTitle>
        <CardDescription className="text-gray-400">Your recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Film</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Amount</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-gray-700">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden">
                      {transaction.films?.poster_url && (
                        <img
                          src={transaction.films.poster_url || "/placeholder.svg"}
                          alt={transaction.films.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-white font-medium">{transaction.films?.title || "Unknown Film"}</span>
                  </div>
                </TableCell>
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
                <TableCell className="text-white font-medium">
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
                          : "bg-red-600 text-white"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {transaction.status === "completed" && (
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
