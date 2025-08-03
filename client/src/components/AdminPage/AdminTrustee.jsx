import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

const AdminTrustee = () => {
  const mockTrustees = [
    { address: "0x1234...5678", role: "Admin", addedDate: "2024-01-15" },
    { address: "0x9abc...def0", role: "Content Creator", addedDate: "2024-02-01" },
    { address: "0x5678...9abc", role: "Moderator", addedDate: "2024-02-15" },
  ]

  return (
    <div className="space-y-6">
      {/* Current Trustees */}
      <Card className="bg-white border border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-neutral-800">Current Trustees</CardTitle>
          <CardDescription className="text-neutral-600">Manage platform trustees and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTrustees.map((trustee, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                <div className="flex-1">
                  <div className="font-mono text-sm text-neutral-800">{trustee.address}</div>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{trustee.role}</Badge>
                    <span className="text-sm text-neutral-500">Added: {trustee.addedDate}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200">
                  <X className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Trustee */}
      <Card className="bg-white border border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-neutral-800">
            <Plus className="w-5 h-5 text-emerald-600" />
            <span>Add New Trustee</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trusteeAddress" className="text-neutral-700">Wallet Address</Label>
              <Input id="trusteeAddress" placeholder="0x..." className="font-mono border-neutral-300 focus:border-emerald-500 focus:ring-emerald-500" />
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Trustee
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminTrustee