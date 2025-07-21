import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  DollarSign,
  Star,
  MapPin,
  User
} from 'lucide-react'
import { format } from 'date-fns'

interface FilterOptions {
  status: string[]
  source: string[]
  budgetMin: string
  budgetMax: string
  rating: string[]
  location: string
  dateFrom: Date | undefined
  dateTo: Date | undefined
  assignedAgent: string
  tags: string[]
}

interface MoreFiltersDialogProps {
  onFiltersApply: (filters: FilterOptions) => void
  trigger?: React.ReactNode
}

const leadStatuses = ['New', 'Contacted', 'Qualified', 'Interested', 'Viewing', 'Negotiating', 'Closed Won', 'Closed Lost']
const leadSources = ['Website', 'Referral', 'Social Media', 'Cold Call', 'Walk-in', 'Advertisement', 'Email Campaign', 'Open House', 'Other']
const agents = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Jennifer Wilson']
const commonTags = ['First Time Buyer', 'Investor', 'Luxury', 'Commercial', 'Rental', 'Urgent', 'Cash Buyer']

export function MoreFiltersDialog({ onFiltersApply, trigger }: MoreFiltersDialogProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    source: [],
    budgetMin: '',
    budgetMax: '',
    rating: [],
    location: '',
    dateFrom: undefined,
    dateTo: undefined,
    assignedAgent: 'all',
    tags: []
  })

  const handleStatusChange = (status: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      status: checked 
        ? [...prev.status, status]
        : prev.status.filter(s => s !== status)
    }))
  }

  const handleSourceChange = (source: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      source: checked 
        ? [...prev.source, source]
        : prev.source.filter(s => s !== source)
    }))
  }

  const handleRatingChange = (rating: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      rating: checked 
        ? [...prev.rating, rating]
        : prev.rating.filter(r => r !== rating)
    }))
  }

  const handleTagChange = (tag: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      tags: checked 
        ? [...prev.tags, tag]
        : prev.tags.filter(t => t !== tag)
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      status: [],
      source: [],
      budgetMin: '',
      budgetMax: '',
      rating: [],
      location: '',
      dateFrom: undefined,
      dateTo: undefined,
      assignedAgent: 'all',
      tags: []
    })
  }

  const applyFilters = () => {
    onFiltersApply(filters)
    setOpen(false)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.status.length > 0) count++
    if (filters.source.length > 0) count++
    if (filters.budgetMin || filters.budgetMax) count++
    if (filters.rating.length > 0) count++
    if (filters.location) count++
    if (filters.dateFrom || filters.dateTo) count++
    if (filters.assignedAgent && filters.assignedAgent !== 'all') count++
    if (filters.tags.length > 0) count++
    return count
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Filter className="h-4 w-4 mr-2" />
      More Filters
      {getActiveFiltersCount() > 0 && (
        <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {getActiveFiltersCount()}
        </Badge>
      )}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Advanced Filters</span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Lead Status</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {leadStatuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Source Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Lead Source</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {leadSources.map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={`source-${source}`}
                    checked={filters.source.includes(source)}
                    onCheckedChange={(checked) => handleSourceChange(source, checked as boolean)}
                  />
                  <Label htmlFor={`source-${source}`} className="text-sm">
                    {source}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Budget Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Budget Range</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin" className="text-sm">Minimum Budget</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="0"
                  value={filters.budgetMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, budgetMin: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax" className="text-sm">Maximum Budget</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="No limit"
                  value={filters.budgetMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, budgetMax: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Rating Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Lead Rating</span>
            </Label>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.rating.includes(rating.toString())}
                    onCheckedChange={(checked) => handleRatingChange(rating.toString(), checked as boolean)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="flex items-center space-x-1">
                    <span>{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Location & Agent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="location" className="text-base font-semibold flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </Label>
              <Input
                id="location"
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Assigned Agent</span>
              </Label>
              <Select value={filters.assignedAgent} onValueChange={(value) => setFilters(prev => ({ ...prev, assignedAgent: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Date Added</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Tags</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={filters.tags.includes(tag)}
                    onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                  />
                  <Label htmlFor={`tag-${tag}`} className="text-sm">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
            Apply Filters ({getActiveFiltersCount()})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}