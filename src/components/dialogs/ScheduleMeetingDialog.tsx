import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Video,
  Phone,
  Building
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'

interface ScheduleMeetingDialogProps {
  trigger?: React.ReactNode
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

const meetingTypes = [
  { value: 'property-viewing', label: 'Property Viewing', icon: Building },
  { value: 'consultation', label: 'Consultation', icon: User },
  { value: 'video-call', label: 'Video Call', icon: Video },
  { value: 'phone-call', label: 'Phone Call', icon: Phone }
]

const mockLeads = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@email.com' },
  { id: '2', name: 'Mike Chen', email: 'mike.chen@email.com' },
  { id: '3', name: 'Jennifer Smith', email: 'jennifer.smith@email.com' },
  { id: '4', name: 'David Wilson', email: 'david.wilson@email.com' }
]

export function ScheduleMeetingDialog({ trigger }: ScheduleMeetingDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs())
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dayjs())
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    leadId: '',
    duration: '60',
    location: '',
    description: '',
    reminder: '15'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.type || !selectedDateTime) {
        toast.error('Please fill in all required fields')
        return
      }

      // Create meeting object
      const meetingData = {
        id: `meeting_${Date.now()}`,
        title: formData.title,
        type: formData.type,
        leadId: formData.leadId,
        dateTime: selectedDateTime.toISOString(),
        duration: parseInt(formData.duration),
        location: formData.location,
        description: formData.description,
        reminder: parseInt(formData.reminder),
        createdAt: new Date().toISOString(),
        userId: 'current_user_id'
      }

      // Here you would typically save to the database
      console.log('Created meeting:', meetingData)
      toast.success('Meeting scheduled successfully!')
      
      // Reset form and close modal
      setFormData({
        title: '',
        type: '',
        leadId: '',
        duration: '60',
        location: '',
        description: '',
        reminder: '15'
      })
      setSelectedDate(dayjs())
      setSelectedDateTime(dayjs())
      setOpen(false)
      
    } catch (error) {
      console.error('Failed to schedule meeting:', error)
      toast.error('Failed to schedule meeting')
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700">
      <CalendarIcon className="h-4 w-4 mr-2" />
      Schedule Meeting
    </Button>
  )

  const selectedLead = formData.leadId !== 'none' ? mockLeads.find(lead => lead.id === formData.leadId) : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            <span>Schedule Meeting</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Meeting Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Meeting Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter meeting title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Meeting Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meeting type" />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leadId">Lead (Optional)</Label>
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
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Date & Time</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="datetime">Date & Time *</Label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={selectedDateTime}
                        onChange={(newValue) => setSelectedDateTime(newValue)}
                        disablePast
                        sx={{
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            height: '40px',
                            fontSize: '14px'
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location & Additional Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter meeting location or video call link"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add meeting agenda or notes..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminder">Reminder</Label>
                  <Select value={formData.reminder} onValueChange={(value) => setFormData(prev => ({ ...prev, reminder: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes before</SelectItem>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                      <SelectItem value="1440">1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Right Column - Calendar & Preview */}
            <div className="space-y-6">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Select Date</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      value={selectedDate}
                      onChange={(newValue) => {
                        setSelectedDate(newValue)
                        // Update the datetime picker to use the new date
                        if (newValue && selectedDateTime) {
                          setSelectedDateTime(selectedDateTime.date(newValue.date()).month(newValue.month()).year(newValue.year()))
                        }
                      }}
                      disablePast
                      sx={{
                        width: '100%',
                        '& .MuiPickersDay-root': {
                          fontSize: '14px'
                        }
                      }}
                    />
                  </LocalizationProvider>
                </CardContent>
              </Card>

              {/* Meeting Preview */}
              {(formData.title || selectedDateTime) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Meeting Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {formData.title && (
                      <div>
                        <p className="text-sm text-gray-500">Title</p>
                        <p className="font-medium">{formData.title}</p>
                      </div>
                    )}
                    
                    {formData.type && (
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <Badge variant="outline">
                          {meetingTypes.find(t => t.value === formData.type)?.label}
                        </Badge>
                      </div>
                    )}

                    {selectedLead && (
                      <div>
                        <p className="text-sm text-gray-500">Attendee</p>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{selectedLead.name}</p>
                            <p className="text-xs text-gray-500">{selectedLead.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDateTime && (
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {selectedDateTime.format("dddd, MMMM D, YYYY")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {selectedDateTime.format("h:mm A")} ({formData.duration} minutes)
                          </span>
                        </div>
                      </div>
                    )}

                    {formData.location && (
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formData.location}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}