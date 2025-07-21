import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScheduleMeetingDialog } from '@/components/dialogs/ScheduleMeetingDialog'
import { QuickAddDialog } from '@/components/dialogs/QuickAddDialog'
import { blink } from '@/blink/client'
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp,
  Calendar,
  CheckSquare,
  Phone,
  Mail
} from 'lucide-react'

export function Dashboard() {
  const [stats, setStats] = useState({
    activeLeads: 0,
    propertiesListed: 0,
    pipelineValue: 0,
    dealsClosed: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const user = await blink.auth.me()
        
        // Load leads count
        const leads = await blink.db.leads.list({
          where: { userId: user.id }
        })
        
        // Load properties count
        const properties = await blink.db.properties.list({
          where: { userId: user.id }
        })
        
        // Calculate pipeline value from leads with budgets
        const pipelineValue = leads.reduce((total, lead) => {
          return total + (lead.budget || 0)
        }, 0)
        
        // Load deals count (you might need to create this table)
        // For now, we'll use a mock value
        
        setStats({
          activeLeads: leads.length,
          propertiesListed: properties.length,
          pipelineValue,
          dealsClosed: 8 // Mock value
        })
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your real estate business today.</p>
        </div>
        <div className="flex space-x-2">
          <QuickAddDialog />
          <ScheduleMeetingDialog />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.activeLeads}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Listed</CardTitle>
            <Building className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.propertiesListed}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : formatCurrency(stats.pipelineValue)}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
            <CheckSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.dealsClosed}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "New lead added",
                  details: "Sarah Johnson - Looking for 3BR home in Downtown",
                  time: "2 hours ago",
                  type: "lead"
                },
                {
                  action: "Property viewing scheduled",
                  details: "123 Oak Street - Meeting with Mike Chen",
                  time: "4 hours ago",
                  type: "property"
                },
                {
                  action: "Deal moved to negotiation",
                  details: "$450K offer on Maple Avenue property",
                  time: "6 hours ago",
                  type: "deal"
                },
                {
                  action: "Task completed",
                  details: "Follow up call with Jennifer Smith",
                  time: "1 day ago",
                  type: "task"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'lead' ? 'bg-blue-500' :
                    activity.type === 'property' ? 'bg-amber-500' :
                    activity.type === 'deal' ? 'bg-green-500' : 'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Tasks */}
        <div className="space-y-6">
          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Today's Tasks
                <Badge variant="secondary">5</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { task: "Call John about property viewing", priority: "high", time: "10:00 AM" },
                  { task: "Prepare listing documents", priority: "medium", time: "2:00 PM" },
                  { task: "Follow up with mortgage broker", priority: "low", time: "4:00 PM" }
                ].map((task, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.task}</p>
                      <p className="text-xs text-gray-500">{task.time}</p>
                    </div>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-2">
                  <Phone className="h-5 w-5" />
                  <span className="text-xs">Call Lead</span>
                </Button>
                <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-2">
                  <Mail className="h-5 w-5" />
                  <span className="text-xs">Send Email</span>
                </Button>
                <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-2">
                  <Building className="h-5 w-5" />
                  <span className="text-xs">Add Property</span>
                </Button>
                <QuickAddDialog 
                  defaultTab="lead"
                  trigger={
                    <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-2">
                      <Users className="h-5 w-5" />
                      <span className="text-xs">New Lead</span>
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}