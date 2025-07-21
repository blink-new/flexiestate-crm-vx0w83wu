import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CreateLeadForm } from '@/components/forms/CreateLeadForm'
import { LeadProfileDialog } from '@/components/dialogs/LeadProfileDialog'
import { MoreFiltersDialog } from '@/components/dialogs/MoreFiltersDialog'
import { QuickAddDialog } from '@/components/dialogs/QuickAddDialog'
import { blink } from '@/blink/client'
import { Lead } from '@/types'
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  DollarSign,
  MoreHorizontal,
  Star
} from 'lucide-react'

// Helper function to get lead rating (mock for now)
const getLeadRating = (lead: Lead) => {
  // This could be calculated based on budget, engagement, etc.
  if (lead.budget && lead.budget > 500000) return 5
  if (lead.budget && lead.budget > 300000) return 4
  if (lead.status === 'hot') return 5
  if (lead.status === 'warm') return 4
  return 3
}

export function Leads() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [filters, setFilters] = useState<any>(null)

  // Load leads from database
  useEffect(() => {
    const loadLeads = async () => {
      try {
        const user = await blink.auth.me()
        const leadsData = await blink.db.leads.list({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        })
        setLeads(leadsData)
      } catch (error) {
        console.error('Failed to load leads:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLeads()
  }, [])

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || lead.status.toLowerCase() === selectedStatus.toLowerCase()
    
    // Apply advanced filters if they exist
    if (filters) {
      if (filters.status.length > 0 && !filters.status.includes(lead.status)) return false
      if (filters.source.length > 0 && !filters.source.includes(lead.source)) return false
      if (filters.budgetMin && lead.budget && lead.budget < parseInt(filters.budgetMin)) return false
      if (filters.budgetMax && lead.budget && lead.budget > parseInt(filters.budgetMax)) return false
      // Add more filter logic as needed
    }
    
    return matchesSearch && matchesStatus
  })

  const handleViewProfile = (lead: Lead) => {
    setSelectedLead(lead)
    setProfileDialogOpen(true)
  }

  const handleLeadCreated = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev])
  }

  const handleFiltersApply = (newFilters: any) => {
    setFilters(newFilters)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800'
      case 'warm': return 'bg-yellow-100 text-yellow-800'
      case 'cold': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">Manage your potential clients and track their journey</p>
        </div>
        <div className="flex space-x-2">
          <QuickAddDialog defaultTab="lead" />
          <CreateLeadForm onLeadCreated={handleLeadCreated} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {loading ? '...' : leads.filter(lead => lead.status.toLowerCase() === 'hot').length}
              </p>
              <p className="text-sm text-gray-600">Hot Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {loading ? '...' : leads.filter(lead => lead.status.toLowerCase() === 'warm').length}
              </p>
              <p className="text-sm text-gray-600">Warm Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {loading ? '...' : leads.filter(lead => lead.status.toLowerCase() === 'cold').length}
              </p>
              <p className="text-sm text-gray-600">Cold Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {loading ? '...' : formatCurrency(leads.reduce((total, lead) => total + (lead.budget || 0), 0))}
              </p>
              <p className="text-sm text-gray-600">Total Pipeline</p>
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
                  placeholder="Search leads by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'hot', 'warm', 'cold'].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="capitalize"
                >
                  {status === 'all' ? 'All Leads' : `${status} Leads`}
                </Button>
              ))}
            </div>
            <MoreFiltersDialog onFiltersApply={handleFiltersApply} />
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {lead.firstName[0]}{lead.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{lead.firstName} {lead.lastName}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < getLeadRating(lead) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {lead.email}
                </div>
                {lead.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {lead.phone}
                  </div>
                )}
              </div>

              {/* Budget & Source */}
              <div className="flex items-center justify-between">
                {lead.budget && (
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                    <span className="font-medium text-green-600">
                      {formatCurrency(lead.budget)}
                    </span>
                  </div>
                )}
                <Badge variant="outline" className="text-xs">
                  {lead.source}
                </Badge>
              </div>

              {/* Notes */}
              {lead.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 line-clamp-2">{lead.notes}</p>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Added: {new Date(lead.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleViewProfile(lead)}
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
                <p className="text-gray-600 mt-1">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first lead'}
                </p>
              </div>
              <CreateLeadForm 
                onLeadCreated={handleLeadCreated}
                trigger={
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Lead
                  </Button>
                } 
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lead Profile Dialog */}
      <LeadProfileDialog 
        lead={selectedLead}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
    </div>
  )
}