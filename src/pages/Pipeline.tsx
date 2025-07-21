import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  DollarSign, 
  Calendar, 
  User, 
  Building,
  Plus,
  MoreHorizontal,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Deal, PipelineStage } from '@/types'
import toast from 'react-hot-toast'

// Mock data for pipeline stages
const initialStages: PipelineStage[] = [
  { id: '1', name: 'New Leads', color: 'bg-gray-100', order: 1, userId: '' },
  { id: '2', name: 'Qualified', color: 'bg-blue-100', order: 2, userId: '' },
  { id: '3', name: 'Viewing', color: 'bg-yellow-100', order: 3, userId: '' },
  { id: '4', name: 'Negotiation', color: 'bg-orange-100', order: 4, userId: '' },
  { id: '5', name: 'Closed Won', color: 'bg-green-100', order: 5, userId: '' }
]

// Mock deals data
const initialDeals: Deal[] = [
  {
    id: '1',
    title: 'Downtown Condo Sale',
    value: 450000,
    stageId: '3',
    leadId: 'lead1',
    propertyId: 'prop1',
    probability: 75,
    expectedCloseDate: '2024-02-15',
    notes: 'Client very interested, scheduling second viewing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: ''
  },
  {
    id: '2',
    title: 'Family Home Purchase',
    value: 680000,
    stageId: '4',
    leadId: 'lead2',
    propertyId: 'prop2',
    probability: 90,
    expectedCloseDate: '2024-02-20',
    notes: 'Offer submitted, waiting for response',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: ''
  },
  {
    id: '3',
    title: 'Investment Property',
    value: 320000,
    stageId: '2',
    leadId: 'lead3',
    propertyId: 'prop3',
    probability: 60,
    expectedCloseDate: '2024-03-01',
    notes: 'Investor looking for rental properties',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: ''
  },
  {
    id: '4',
    title: 'Luxury Penthouse',
    value: 1200000,
    stageId: '1',
    leadId: 'lead4',
    propertyId: 'prop4',
    probability: 40,
    expectedCloseDate: '2024-03-15',
    notes: 'High-end client, needs special attention',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: ''
  },
  {
    id: '5',
    title: 'Starter Home',
    value: 280000,
    stageId: '2',
    leadId: 'lead5',
    propertyId: 'prop5',
    probability: 70,
    expectedCloseDate: '2024-02-28',
    notes: 'First-time buyers, need guidance',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: ''
  }
]

// Mock lead/property data for display
const mockLeads: Record<string, { name: string; avatar: string }> = {
  'lead1': { name: 'Sarah Johnson', avatar: 'SJ' },
  'lead2': { name: 'Mike Chen', avatar: 'MC' },
  'lead3': { name: 'Jennifer Smith', avatar: 'JS' },
  'lead4': { name: 'Robert Williams', avatar: 'RW' },
  'lead5': { name: 'Emily Davis', avatar: 'ED' }
}

const mockProperties: Record<string, string> = {
  'prop1': '123 Oak Street',
  'prop2': '456 Maple Avenue',
  'prop3': '789 Pine Road',
  'prop4': '321 Luxury Lane',
  'prop5': '654 Starter Street'
}

// Sortable Deal Card Component
function SortableDealCard({ deal }: { deal: Deal }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const lead = mockLeads[deal.leadId]
  const property = mockProperties[deal.propertyId || '']

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-move hover:shadow-md transition-shadow bg-white border border-gray-200",
        isDragging && "shadow-lg ring-2 ring-blue-500"
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Deal Title & Value */}
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900 text-sm leading-tight">
              {deal.title}
            </h4>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>

          {/* Value */}
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(deal.value)}
          </div>

          {/* Lead & Property */}
          <div className="space-y-2">
            <div className="flex items-center text-xs text-gray-600">
              <User className="h-3 w-3 mr-1" />
              {lead?.name || 'Unknown Lead'}
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <Building className="h-3 w-3 mr-1" />
              {property || 'No Property'}
            </div>
          </div>

          {/* Probability & Close Date */}
          <div className="flex items-center justify-between">
            <Badge 
              variant={deal.probability >= 75 ? 'default' : deal.probability >= 50 ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {deal.probability}% likely
            </Badge>
            {deal.expectedCloseDate && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(deal.expectedCloseDate).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Assigned Agent */}
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{lead?.avatar || 'NA'}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">John Doe</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Droppable Stage Column Component
function StageColumn({ stage, deals }: { stage: PipelineStage; deals: Deal[] }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const stageValue = deals.reduce((sum, deal) => sum + deal.value, 0)

  return (
    <div className="space-y-4">
      {/* Stage Header */}
      <div className={cn(
        "rounded-lg p-4 border-2 border-dashed border-gray-300",
        stage.color
      )}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{stage.name}</h3>
          <Badge variant="secondary" className="bg-white">
            {deals.length}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {formatCurrency(stageValue)}
        </p>
      </div>

      {/* Deal Cards */}
      <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[400px]">
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
          
          {/* Add Deal Button */}
          <Button 
            variant="ghost" 
            className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </SortableContext>
    </div>
  )
}

export function Pipeline() {
  const [stages] = useState<PipelineStage[]>(initialStages)
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const getDealsForStage = (stageId: string) => {
    return deals.filter(deal => deal.stageId === stageId)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the deal being dragged
    const activeDeal = deals.find(deal => deal.id === activeId)
    if (!activeDeal) return

    // Determine the new stage
    let newStageId = activeDeal.stageId

    // If dropped on a stage header or another deal, find the stage
    const targetStage = stages.find(stage => stage.id === overId)
    if (targetStage) {
      newStageId = targetStage.id
    } else {
      // If dropped on another deal, find that deal's stage
      const targetDeal = deals.find(deal => deal.id === overId)
      if (targetDeal) {
        newStageId = targetDeal.stageId
      }
    }

    // Update the deal's stage if it changed
    if (newStageId !== activeDeal.stageId) {
      const updatedDeals = deals.map(deal => 
        deal.id === activeId 
          ? { ...deal, stageId: newStageId, updatedAt: new Date().toISOString() }
          : deal
      )
      
      setDeals(updatedDeals)
      
      // Show success message
      const stageName = stages.find(s => s.id === newStageId)?.name || 'Unknown Stage'
      toast.success(`Deal moved to ${stageName}`)

      // Here you would typically update the database
      try {
        // await blink.db.deals.update(activeId, { stageId: newStageId })
        console.log(`Updated deal ${activeId} to stage ${newStageId}`)
      } catch (error) {
        console.error('Failed to update deal:', error)
        toast.error('Failed to update deal')
        // Revert the change on error
        setDeals(deals)
      }
    }
  }

  const activeDeal = activeId ? deals.find(deal => deal.id === activeId) : null

  // Calculate pipeline stats
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const activeDealsCount = deals.length
  const avgDealSize = activeDealsCount > 0 ? totalValue / activeDealsCount : 0
  const winRate = 68 // This would be calculated from historical data

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
          <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-1">Drag and drop deals between stages to update their status</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Customize Stages
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900">{activeDealsCount}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Deal Size</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgDealSize)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900">{winRate}%</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board with Drag and Drop */}
      <div className="bg-gray-50 rounded-lg p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[600px]">
            {stages.map((stage) => (
              <StageColumn 
                key={stage.id} 
                stage={stage} 
                deals={getDealsForStage(stage.id)} 
              />
            ))}
          </div>
          
          {/* Drag Overlay */}
          <DragOverlay>
            {activeDeal ? <SortableDealCard deal={activeDeal} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Pipeline Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <h4 className="font-medium text-blue-900">Pipeline Management Tips</h4>
              <p className="text-sm text-blue-700 mt-1">
                Drag deals between stages to update their status. The pipeline automatically calculates totals and probabilities. 
                Keep your deals updated to maintain accurate forecasting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}