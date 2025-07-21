import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  User, 
  Building, 
  CheckSquare,
  Phone,
  Mail,
  DollarSign
} from 'lucide-react'
import { blink } from '@/blink/client'
import toast from 'react-hot-toast'

interface QuickAddDialogProps {
  trigger?: React.ReactNode
  defaultTab?: 'lead' | 'property' | 'task'
}

export function QuickAddDialog({ trigger, defaultTab = 'lead' }: QuickAddDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Lead form state
  const [leadData, setLeadData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
    budget: '',
    notes: ''
  })

  // Property form state
  const [propertyData, setPropertyData] = useState({
    title: '',
    address: '',
    price: '',
    propertyType: 'House',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    status: 'Available',
    description: ''
  })

  // Task form state
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    leadId: '',
    propertyId: ''
  })

  const handleLeadSubmit = async () => {
    setLoading(true)
    try {
      if (!leadData.firstName || !leadData.lastName || !leadData.email) {
        toast.error('Please fill in required fields')
        return
      }

      const user = await blink.auth.me()
      
      const newLead = await blink.db.leads.create({
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone || null,
        status: leadData.status,
        source: leadData.source,
        budget: leadData.budget ? parseInt(leadData.budget) : null,
        notes: leadData.notes || null,
        userId: user.id
      })

      toast.success('Lead created successfully!')
      
      // Reset form
      setLeadData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'New',
        source: 'Website',
        budget: '',
        notes: ''
      })
      
      setOpen(false)
    } catch (error) {
      console.error('Failed to create lead:', error)
      toast.error('Failed to create lead')
    } finally {
      setLoading(false)
    }
  }

  const handlePropertySubmit = async () => {
    setLoading(true)
    try {
      if (!propertyData.title || !propertyData.address || !propertyData.price) {
        toast.error('Please fill in required fields')
        return
      }

      const user = await blink.auth.me()
      
      const newProperty = await blink.db.properties.create({
        title: propertyData.title,
        address: propertyData.address,
        price: parseInt(propertyData.price),
        propertyType: propertyData.propertyType,
        bedrooms: propertyData.bedrooms ? parseInt(propertyData.bedrooms) : null,
        bathrooms: propertyData.bathrooms ? parseInt(propertyData.bathrooms) : null,
        squareFeet: propertyData.squareFeet ? parseInt(propertyData.squareFeet) : null,
        status: propertyData.status,
        description: propertyData.description || null,
        userId: user.id
      })

      toast.success('Property created successfully!')
      
      // Reset form
      setPropertyData({
        title: '',
        address: '',
        price: '',
        propertyType: 'House',
        bedrooms: '',
        bathrooms: '',
        squareFeet: '',
        status: 'Available',
        description: ''
      })
      
      setOpen(false)
    } catch (error) {
      console.error('Failed to create property:', error)
      toast.error('Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskSubmit = async () => {
    setLoading(true)
    try {
      if (!taskData.title) {
        toast.error('Please enter a task title')
        return
      }

      const user = await blink.auth.me()
      
      const newTask = await blink.db.tasks.create({
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority,
        status: 'pending',
        dueDate: taskData.dueDate || null,
        assignedTo: taskData.assignedTo || null,
        leadId: taskData.leadId || null,
        propertyId: taskData.propertyId || null,
        userId: user.id
      })

      toast.success('Task created successfully!')
      
      // Reset form
      setTaskData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: '',
        leadId: '',
        propertyId: ''
      })
      
      setOpen(false)
    } catch (error) {
      console.error('Failed to create task:', error)
      toast.error('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700">
      <Plus className="h-4 w-4 mr-2" />
      Quick Add
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-blue-600" />
            <span>Quick Add</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lead" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Lead</span>
            </TabsTrigger>
            <TabsTrigger value="property" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Property</span>
            </TabsTrigger>
            <TabsTrigger value="task" className="flex items-center space-x-2">
              <CheckSquare className="h-4 w-4" />
              <span>Task</span>
            </TabsTrigger>
          </TabsList>

          {/* Lead Tab */}
          <TabsContent value="lead" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead-firstName">First Name *</Label>
                <Input
                  id="lead-firstName"
                  value={leadData.firstName}
                  onChange={(e) => setLeadData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-lastName">Last Name *</Label>
                <Input
                  id="lead-lastName"
                  value={leadData.lastName}
                  onChange={(e) => setLeadData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead-email" className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>Email *</span>
                </Label>
                <Input
                  id="lead-email"
                  type="email"
                  value={leadData.email}
                  onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-phone" className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </Label>
                <Input
                  id="lead-phone"
                  value={leadData.phone}
                  onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead-status">Status</Label>
                <Select value={leadData.status} onValueChange={(value) => setLeadData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Interested">Interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-source">Source</Label>
                <Select value={leadData.source} onValueChange={(value) => setLeadData(prev => ({ ...prev, source: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-budget" className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Budget</span>
                </Label>
                <Input
                  id="lead-budget"
                  type="number"
                  value={leadData.budget}
                  onChange={(e) => setLeadData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-notes">Notes</Label>
              <Textarea
                id="lead-notes"
                value={leadData.notes}
                onChange={(e) => setLeadData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add notes about this lead..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleLeadSubmit} disabled={loading}>
                {loading ? 'Creating...' : 'Create Lead'}
              </Button>
            </div>
          </TabsContent>

          {/* Property Tab */}
          <TabsContent value="property" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property-title">Property Title *</Label>
              <Input
                id="property-title"
                value={propertyData.title}
                onChange={(e) => setPropertyData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Beautiful 3BR Home in Downtown"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="property-address">Address *</Label>
              <Input
                id="property-address"
                value={propertyData.address}
                onChange={(e) => setPropertyData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter full address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property-price">Price *</Label>
                <Input
                  id="property-price"
                  type="number"
                  value={propertyData.price}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-type">Property Type</Label>
                <Select value={propertyData.propertyType} onValueChange={(value) => setPropertyData(prev => ({ ...prev, propertyType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property-bedrooms">Bedrooms</Label>
                <Input
                  id="property-bedrooms"
                  type="number"
                  value={propertyData.bedrooms}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, bedrooms: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-bathrooms">Bathrooms</Label>
                <Input
                  id="property-bathrooms"
                  type="number"
                  value={propertyData.bathrooms}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, bathrooms: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-sqft">Square Feet</Label>
                <Input
                  id="property-sqft"
                  type="number"
                  value={propertyData.squareFeet}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, squareFeet: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="property-description">Description</Label>
              <Textarea
                id="property-description"
                value={propertyData.description}
                onChange={(e) => setPropertyData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the property..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePropertySubmit} disabled={loading}>
                {loading ? 'Creating...' : 'Create Property'}
              </Button>
            </div>
          </TabsContent>

          {/* Task Tab */}
          <TabsContent value="task" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title *</Label>
              <Input
                id="task-title"
                value={taskData.title}
                onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={taskData.description}
                onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the task..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={taskData.priority} onValueChange={(value) => setTaskData(prev => ({ ...prev, priority: value }))}>
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
                <Label htmlFor="task-dueDate">Due Date</Label>
                <Input
                  id="task-dueDate"
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTaskSubmit} disabled={loading}>
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}