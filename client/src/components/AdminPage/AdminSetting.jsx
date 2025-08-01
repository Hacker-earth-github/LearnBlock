import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      {/* Platform Settings */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>Configure platform parameters and rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Reward Configuration</h3>
              <div className="space-y-2">
                <Label>XFI per Point</Label>
                <Input defaultValue="0.1" type="number" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>Points per Badge</Label>
                <Input defaultValue="500" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Golden Badge Threshold</Label>
                <Input defaultValue="5" type="number" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Contract Information</h3>
              <div className="space-y-2">
                <Label>Contract Address</Label>
                <Input value="0x1234567890abcdef..." readOnly className="font-mono bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label>Contract Balance</Label>
                <Input value="1,250.5 XFI" readOnly className="bg-slate-50" />
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Fund Contract
              </Button>
            </div>
          </div>

          <Button className="bg-purple-600 hover:bg-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSettings