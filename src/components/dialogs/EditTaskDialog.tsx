import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Clock, User, Building } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { Task } from '@/types'

interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: Task) => void
}

const mockLeads = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@email.com' },
  { id: '2', name: 'Mike Chen', email: 'mike.chen@email.com' },
  { id: '3', name: 'Jennifer Smith', email: 'jennifer.smith@email.com' },
  { id: '4', name: 'David Wilson', email: 'david.wilson@email.com' }
]

const mockProperties = [
  { id: '1', address: '123 Oak Street', type: 'Condo' },
  { id: '2', address: '456 Maple Avenue', type: 'House' },
  { id: '3', address: '789 Pine Road', type: 'Townhouse' }
]

export function EditTaskDialog({ task, open, onOpenChange, onSave }: EditTaskDialogProps) {
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    dueDate: '',
    assignedTo: '',
    leadId: '',
    propertyId: ''
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate || '',
        assignedTo: task.assignedTo || '',
        leadId: task.leadId || '',
        propertyId: task.propertyId || ''
      })
      if (task.dueDate) {
        setSelectedDate(new Date(task.dueDate))
      }
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return

    setLoading(true)

    try {
      if (!formData.title.trim()) {
        toast.error('Task title is required')
        return
      }

      const updatedTask: Task = {
        ...task,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        dueDate: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
        assignedTo: formData.assignedTo || undefined,
        leadId: formData.leadId === 'none' ? undefined : formData.leadId || undefined,
        propertyId: formData.propertyId === 'none' ? undefined : formData.propertyId || undefined,
        updatedAt: new Date().toISOString()
      }

      onSave(updatedTask)
      toast.success('Task updated successfully!')
      onOpenChange(false)
      
    } catch (error) {
      console.error('Failed to update task:', error)
      toast.error('Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  if (!task) return null

  const selectedLead = formData.leadId !== 'none' ? mockLeads.find(lead => lead.id === formData.leadId) : null
  const selectedProperty = formData.propertyId !== 'none' ? mockProperties.find(prop => prop.id === formData.propertyId) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Edit Task</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'pending' | 'in-progress' | 'completed') => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Assignment & Relations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Assignment & Relations</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                    placeholder="Enter assignee name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leadId">Related Lead</Label>
                  <Select value={formData.leadId} onValueChange={(value) => setFormData(prev => ({ ...prev, leadId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a lead" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No lead selected</SelectItem>
                      {mockLeads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-xs text-gray-500">{lead.email}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyId">Related Property</Label>
                  <Select value={formData.propertyId} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No property selected</SelectItem>
                      {mockProperties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          <div>
                            <div className="font-medium">{property.address}</div>
                            <div className="text-xs text-gray-500">{property.type}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Right Column - Calendar & Preview */}
            <div className="space-y-6">
              {/* Calendar */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Label className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Due Date</span>
                    </Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Task Preview */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-semibold">Task Preview</h4>
                  
                  {formData.title && (
                    <div>
                      <p className="text-sm text-gray-500">Title</p>
                      <p className="font-medium">{formData.title}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={formData.priority === 'high' ? 'destructive' : formData.priority === 'medium' ? 'default' : 'secondary'}>
                      {formData.priority}
                    </Badge>
                    <Badge variant="outline">
                      {formData.status.replace('-', ' ')}
                    </Badge>
                  </div>

                  {selectedDate && (
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedLead && (
                    <div>
                      <p className="text-sm text-gray-500">Related Lead</p>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{selectedLead.name}</p>
                          <p className="text-xs text-gray-500">{selectedLead.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProperty && (
                    <div>
                      <p className="text-sm text-gray-500">Related Property</p>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{selectedProperty.address}</p>
                          <p className="text-xs text-gray-500">{selectedProperty.type}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}