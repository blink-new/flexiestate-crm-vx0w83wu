import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Star,
  Edit,
  MessageSquare,
  FileText,
  Activity,
  Building
} from 'lucide-react'
import { Lead } from '@/types'

interface LeadProfileDialogProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadProfileDialog({ lead, open, onOpenChange }: LeadProfileDialogProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!lead) return null

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-200'
      case 'warm': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'new': return 'bg-green-100 text-green-800 border-green-200'
      case 'contacted': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'qualified': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'interested': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'viewing': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'negotiating': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'closed won': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'closed lost': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Mock data for demonstration
  const mockActivities = [
    {
      id: '1',
      type: 'call',
      description: 'Called to discuss property preferences',
      date: '2024-01-20T10:30:00Z',
      duration: '15 minutes'
    },
    {
      id: '2',
      type: 'email',
      description: 'Sent property listings matching criteria',
      date: '2024-01-19T14:15:00Z'
    },
    {
      id: '3',
      type: 'meeting',
      description: 'Property viewing scheduled',
      date: '2024-01-18T16:00:00Z'
    }
  ]

  const mockProperties = [
    {
      id: '1',
      title: '123 Oak Street',
      price: 450000,
      type: 'Condo',
      status: 'Interested'
    },
    {
      id: '2',
      title: '456 Maple Avenue',
      price: 520000,
      type: 'House',
      status: 'Viewed'
    }
  ]

  const mockTasks = [
    {
      id: '1',
      title: 'Follow up on property viewing',
      dueDate: '2024-01-25',
      priority: 'high',
      completed: false
    },
    {
      id: '2',
      title: 'Send mortgage pre-approval information',
      dueDate: '2024-01-23',
      priority: 'medium',
      completed: false
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                  {lead.firstName[0]}{lead.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {lead.firstName} {lead.lastName}
                </DialogTitle>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  <Badge variant="outline">
                    {lead.source}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Contact Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{lead.email}</p>
                        <p className="text-xs text-gray-500">Primary Email</p>
                      </div>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{lead.phone}</p>
                          <p className="text-xs text-gray-500">Primary Phone</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{formatDate(lead.createdAt)}</p>
                        <p className="text-xs text-gray-500">Date Added</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lead Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Lead Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lead.budget && (
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(lead.budget)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Lead Source</p>
                      <p className="text-sm font-medium">{lead.source}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              {lead.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Notes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Phone className="h-5 w-5" />
                      <span className="text-xs">Call</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Mail className="h-5 w-5" />
                      <span className="text-xs">Email</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-xs">Message</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Calendar className="h-5 w-5" />
                      <span className="text-xs">Schedule</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'call' ? 'bg-blue-500' :
                          activity.type === 'email' ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(activity.date)}
                            {activity.duration && ` • ${activity.duration}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Associated Properties</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockProperties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-gray-600">{property.type} • {formatCurrency(property.price)}</p>
                        </div>
                        <Badge variant="outline">{property.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Tasks</span>
                    </div>
                    <Button size="sm">Add Task</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                        <input 
                          type="checkbox" 
                          checked={task.completed}
                          className="rounded border-gray-300"
                          readOnly
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-gray-500">Due: {formatDate(task.dueDate)}</p>
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
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}