import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  User,
  Building,
  Phone,
  Mail,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react'
import { EditTaskDialog } from '@/components/dialogs/EditTaskDialog'
import { LeadProfileDialog } from '@/components/dialogs/LeadProfileDialog'
import { PropertyProfileDialog } from '@/components/dialogs/PropertyProfileDialog'
import { ScheduleMeetingDialog } from '@/components/dialogs/ScheduleMeetingDialog'
import { Task, Lead, Property } from '@/types'
import toast from 'react-hot-toast'

// Mock data
const mockTasks: (Task & { leadName?: string; propertyAddress?: string; type?: string })[] = [
  {
    id: '1',
    title: 'Call Sarah Johnson about property viewing',
    description: 'Follow up on her interest in the downtown condo',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-25',
    assignedTo: 'John Doe',
    leadId: '1',
    leadName: 'Sarah Johnson',
    propertyId: '1',
    propertyAddress: '123 Oak Street',
    type: 'call',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    userId: 'user1'
  },
  {
    id: '2',
    title: 'Prepare listing documents for Maple Avenue',
    description: 'Gather all necessary paperwork for the new listing',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2024-01-26',
    assignedTo: 'Jane Smith',
    propertyId: '2',
    propertyAddress: '456 Maple Avenue',
    type: 'paperwork',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
    userId: 'user1'
  },
  {
    id: '3',
    title: 'Send market analysis to Mike Chen',
    description: 'Provide comparative market analysis for his budget range',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-01-27',
    assignedTo: 'John Doe',
    leadId: '2',
    leadName: 'Mike Chen',
    type: 'email',
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19',
    userId: 'user1'
  },
  {
    id: '4',
    title: 'Schedule open house for Pine Road property',
    description: 'Coordinate with marketing team for weekend open house',
    priority: 'low',
    status: 'completed',
    dueDate: '2024-01-24',
    assignedTo: 'Jane Smith',
    propertyId: '3',
    propertyAddress: '789 Pine Road',
    type: 'event',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    userId: 'user1'
  },
  {
    id: '5',
    title: 'Follow up with mortgage broker',
    description: 'Check on loan approval status for Jennifer Smith',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-25',
    assignedTo: 'John Doe',
    leadId: '3',
    leadName: 'Jennifer Smith',
    type: 'call',
    createdAt: '2024-01-21',
    updatedAt: '2024-01-21',
    userId: 'user1'
  }
]

const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    status: 'interested',
    source: 'Website',
    budget: 450000,
    notes: 'Looking for a downtown condo with modern amenities',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    userId: 'user1'
  },
  {
    id: '2',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike.chen@email.com',
    phone: '(555) 234-5678',
    status: 'qualified',
    source: 'Referral',
    budget: 600000,
    notes: 'First-time buyer, needs guidance through the process',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19',
    userId: 'user1'
  },
  {
    id: '3',
    firstName: 'Jennifer',
    lastName: 'Smith',
    email: 'jennifer.smith@email.com',
    phone: '(555) 345-6789',
    status: 'viewing',
    source: 'Social Media',
    budget: 750000,
    notes: 'Looking for a family home in good school district',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-21',
    userId: 'user1'
  }
]

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Downtown Luxury Condo',
    address: '123 Oak Street',
    price: 450000,
    propertyType: 'Condo',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    description: 'Modern luxury condo in the heart of downtown with stunning city views',
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-20',
    userId: 'user1'
  },
  {
    id: '2',
    title: 'Charming Family Home',
    address: '456 Maple Avenue',
    price: 520000,
    propertyType: 'House',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    description: 'Beautiful family home with large backyard and updated kitchen',
    status: 'active',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-18',
    userId: 'user1'
  },
  {
    id: '3',
    title: 'Modern Townhouse',
    address: '789 Pine Road',
    price: 380000,
    propertyType: 'Townhouse',
    bedrooms: 2,
    bathrooms: 1.5,
    squareFeet: 1400,
    description: 'Contemporary townhouse with open floor plan and private patio',
    status: 'sold',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15',
    userId: 'user1'
  }
]

export function Tasks() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [tasks, setTasks] = useState(mockTasks)
  
  // Dialog states
  const [editTaskDialog, setEditTaskDialog] = useState<{ open: boolean; task: Task | null }>({ open: false, task: null })
  const [leadProfileDialog, setLeadProfileDialog] = useState<{ open: boolean; lead: Lead | null }>({ open: false, lead: null })
  const [propertyProfileDialog, setPropertyProfileDialog] = useState<{ open: boolean; property: Property | null }>({ open: false, property: null })
  const [scheduleMeetingDialog, setScheduleMeetingDialog] = useState(false)

  // Handler functions
  const handleEditTask = (task: Task) => {
    setEditTaskDialog({ open: true, task })
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully')
  }

  const handleMarkComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const, updatedAt: new Date().toISOString() }
        : task
    ))
    toast.success('Task marked as complete')
  }

  const handleViewLead = (leadId: string) => {
    const lead = mockLeads.find(l => l.id === leadId)
    if (lead) {
      setLeadProfileDialog({ open: true, lead })
    }
  }

  const handleViewProperty = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId)
    if (property) {
      setPropertyProfileDialog({ open: true, property })
    }
  }

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.leadName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone
      case 'email': return Mail
      case 'paperwork': return FileText
      case 'event': return Calendar
      default: return CheckCircle
    }
  }

  const isOverdue = (dueDate?: string) => {
    return dueDate && new Date(dueDate) < new Date() && selectedStatus !== 'completed'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage your daily activities and track progress</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.status === 'in-progress').length}
              </p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {tasks.filter(t => isOverdue(t.dueDate)).length}
              </p>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks by title, description, or lead..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'in-progress', 'completed'].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="capitalize"
                >
                  {status === 'all' ? 'All' : status.replace('-', ' ')}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {['all', 'high', 'medium', 'low'].map((priority) => (
                <Button
                  key={priority}
                  variant={selectedPriority === priority ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPriority(priority)}
                  className="capitalize"
                >
                  {priority === 'all' ? 'All Priority' : priority}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const TaskIcon = getTaskIcon(task.type)
          const overdue = isOverdue(task.dueDate)
          
          return (
            <Card key={task.id} className={`hover:shadow-md transition-shadow ${overdue ? 'border-red-200 bg-red-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <div className="pt-1">
                    <Checkbox 
                      checked={task.status === 'completed'}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                  </div>

                  {/* Task Icon */}
                  <div className="pt-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TaskIcon className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 space-y-3">
                    {/* Title and Badges */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {overdue && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>

                    {/* Task Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Assigned To */}
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span>Assigned to: {task.assignedTo}</span>
                      </div>

                      {/* Created Date */}
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Related Entities */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {task.leadName && (
                        <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          <User className="h-3 w-3 mr-1" />
                          <span>{task.leadName}</span>
                        </div>
                      )}
                      {task.propertyAddress && (
                        <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                          <Building className="h-3 w-3 mr-1" />
                          <span>{task.propertyAddress}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditTask(task)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this task? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteTask(task.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {task.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleMarkComplete(task.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Complete
                        </Button>
                      )}
                      
                      {task.leadId && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewLead(task.leadId!)}
                        >
                          <User className="h-3 w-3 mr-1" />
                          View Lead
                        </Button>
                      )}
                      
                      {task.propertyId && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewProperty(task.propertyId!)}
                        >
                          <Building className="h-3 w-3 mr-1" />
                          View Property
                        </Button>
                      )}

                      <ScheduleMeetingDialog
                        trigger={
                          <Button size="sm" variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            Schedule Meeting
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="text-gray-600 mt-1">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first task'}
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <EditTaskDialog
        task={editTaskDialog.task}
        open={editTaskDialog.open}
        onOpenChange={(open) => setEditTaskDialog({ open, task: null })}
        onSave={handleSaveTask}
      />

      <LeadProfileDialog
        lead={leadProfileDialog.lead}
        open={leadProfileDialog.open}
        onOpenChange={(open) => setLeadProfileDialog({ open, lead: null })}
      />

      <PropertyProfileDialog
        property={propertyProfileDialog.property}
        open={propertyProfileDialog.open}
        onOpenChange={(open) => setPropertyProfileDialog({ open, property: null })}
      />
    </div>
  )
}