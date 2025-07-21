import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Bed,
  Bath,
  Square,
  Edit,
  Phone,
  Mail,
  User,
  FileText,
  Activity,
  Eye
} from 'lucide-react'
import { Property } from '@/types'

interface PropertyProfileDialogProps {
  property: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PropertyProfileDialog({ property, open, onOpenChange }: PropertyProfileDialogProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!property) return null

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'sold': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'withdrawn': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
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
      type: 'viewing',
      description: 'Property viewing scheduled with Sarah Johnson',
      date: '2024-01-20T14:30:00Z',
      agent: 'John Doe'
    },
    {
      id: '2',
      type: 'inquiry',
      description: 'Price inquiry from Mike Chen',
      date: '2024-01-19T10:15:00Z',
      agent: 'Jane Smith'
    },
    {
      id: '3',
      type: 'listing',
      description: 'Property listed on MLS',
      date: '2024-01-15T09:00:00Z',
      agent: 'John Doe'
    }
  ]

  const mockInterestedLeads = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      status: 'Viewing Scheduled',
      lastContact: '2024-01-20'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '(555) 234-5678',
      status: 'Interested',
      lastContact: '2024-01-19'
    }
  ]

  const mockTasks = [
    {
      id: '1',
      title: 'Schedule professional photography',
      dueDate: '2024-01-25',
      priority: 'high',
      completed: false,
      assignedTo: 'Jane Smith'
    },
    {
      id: '2',
      title: 'Update listing description',
      dueDate: '2024-01-23',
      priority: 'medium',
      completed: false,
      assignedTo: 'John Doe'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {property.title}
                </DialogTitle>
                <div className="flex items-center space-x-2 mt-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{property.address}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className={getStatusColor(property.status)}>
                    {property.status}
                  </Badge>
                  <Badge variant="outline">
                    {property.propertyType}
                  </Badge>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(property.price)}
                  </span>
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
            <TabsTrigger value="leads">Interested Leads</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[calc(90vh-250px)]">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5" />
                      <span>Property Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {property.bedrooms && (
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Bed className="h-4 w-4 text-gray-500" />
                            <span className="text-lg font-semibold">{property.bedrooms}</span>
                          </div>
                          <p className="text-xs text-gray-500">Bedrooms</p>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Bath className="h-4 w-4 text-gray-500" />
                            <span className="text-lg font-semibold">{property.bathrooms}</span>
                          </div>
                          <p className="text-xs text-gray-500">Bathrooms</p>
                        </div>
                      )}
                      {property.squareFeet && (
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Square className="h-4 w-4 text-gray-500" />
                            <span className="text-lg font-semibold">{property.squareFeet.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500">Sq Ft</p>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Property Type</p>
                        <p className="font-medium">{property.propertyType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(property.price)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Listed Date</p>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatDate(property.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Listing Agent */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Listing Agent</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-gray-600">Senior Real Estate Agent</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">(555) 123-4567</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">john.doe@realestate.com</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              {property.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Description</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{property.description}</p>
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
                      <Eye className="h-5 w-5" />
                      <span className="text-xs">Schedule Viewing</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <DollarSign className="h-5 w-5" />
                      <span className="text-xs">Update Price</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <FileText className="h-5 w-5" />
                      <span className="text-xs">Add Note</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Calendar className="h-5 w-5" />
                      <span className="text-xs">Add Task</span>
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
                          activity.type === 'viewing' ? 'bg-blue-500' :
                          activity.type === 'inquiry' ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(activity.date)} • {activity.agent}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leads" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Interested Leads</span>
                    </div>
                    <Badge variant="outline">{mockInterestedLeads.length} leads</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockInterestedLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-gray-600">{lead.email}</p>
                            <p className="text-xs text-gray-500">Last contact: {formatDate(lead.lastContact)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{lead.status}</Badge>
                          <div className="flex space-x-1 mt-2">
                            <Button variant="outline" size="sm">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
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
                      <span>Property Tasks</span>
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
                          <p className="text-xs text-gray-500">
                            Due: {formatDate(task.dueDate)} • Assigned to: {task.assignedTo}
                          </p>
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