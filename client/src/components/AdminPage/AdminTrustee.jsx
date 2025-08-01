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
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Current Trustees</CardTitle>
          <CardDescription>Manage platform trustees and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTrustees.map((trustee, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-mono text-sm">{trustee.address}</div>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge>{trustee.role}</Badge>
                    <span className="text-sm text-slate-600">Added: {trustee.addedDate}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                  <X className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Trustee */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-green-600" />
            <span>Add New Trustee</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trusteeAddress">Wallet Address</Label>
              <Input id="trusteeAddress" placeholder="0x..." className="font-mono" />
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
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