import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      {/* Platform Settings */}
      <Card className="bg-white border border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-neutral-800">Platform Settings</CardTitle>
          <CardDescription className="text-neutral-600">Configure platform parameters and rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-800">Reward Configuration</h3>
              <div className="space-y-2">
                <Label className="text-neutral-700">XFI per Point</Label>
                <Input defaultValue="0.1" type="number" step="0.01" className="border-neutral-300 focus:border-indigo-500 focus:ring-indigo-500 text-black" />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-700">Points per Badge</Label>
                <Input defaultValue="500" type="number" className="border-neutral-300 focus:border-indigo-500 focus:ring-indigo-500 text-black" />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-700">Golden Badge Threshold</Label>
                <Input defaultValue="5" type="number" className="border-neutral-300 focus:border-indigo-500 focus:ring-indigo-500 text-black" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-800">Contract Information</h3>
              <div className="space-y-2">
                <Label className="text-neutral-700">Contract Address</Label>
                <Input value="0x1234567890abcdef..." readOnly className="font-mono bg-neutral-50 border-neutral-300 text-neutral-600" />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-700">Contract Balance</Label>
                <Input value="1,250.5 XFI" readOnly className="bg-neutral-50 border-neutral-300 text-neutral-600" />
              </div>
              <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50">
                Fund Contract
              </Button>
            </div>
          </div>

          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSettings