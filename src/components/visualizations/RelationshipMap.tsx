import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Building, 
  User, 
  ArrowRight, 
  Network,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RelationshipNode {
  id: string
  type: 'lead' | 'property' | 'agent'
  name: string
  details: string
  status?: string
  value?: number
  x: number
  y: number
  connections: string[]
}

interface RelationshipConnection {
  id: string
  fromId: string
  toId: string
  type: string
  strength: number // 1-5 scale
  label?: string
}

// Mock data for relationship visualization
const mockNodes: RelationshipNode[] = [
  // Agents
  {
    id: 'agent1',
    type: 'agent',
    name: 'John Doe',
    details: 'Senior Agent',
    x: 200,
    y: 100,
    connections: ['lead1', 'lead2', 'prop1', 'prop2']
  },
  {
    id: 'agent2',
    type: 'agent',
    name: 'Jane Smith',
    details: 'Listing Specialist',
    x: 600,
    y: 100,
    connections: ['lead3', 'prop3', 'prop4']
  },
  
  // Leads
  {
    id: 'lead1',
    type: 'lead',
    name: 'Sarah Johnson',
    details: 'First-time buyer',
    status: 'Qualified',
    value: 450000,
    x: 100,
    y: 300,
    connections: ['prop1', 'prop2']
  },
  {
    id: 'lead2',
    type: 'lead',
    name: 'Mike Chen',
    details: 'Investor',
    status: 'Negotiating',
    value: 680000,
    x: 300,
    y: 300,
    connections: ['prop2', 'prop3']
  },
  {
    id: 'lead3',
    type: 'lead',
    name: 'Jennifer Smith',
    details: 'Luxury buyer',
    status: 'Viewing',
    value: 1200000,
    x: 500,
    y: 300,
    connections: ['prop4']
  },
  
  // Properties
  {
    id: 'prop1',
    type: 'property',
    name: '123 Oak Street',
    details: '3BR Condo',
    status: 'Available',
    value: 450000,
    x: 150,
    y: 500,
    connections: []
  },
  {
    id: 'prop2',
    type: 'property',
    name: '456 Maple Ave',
    details: '4BR House',
    status: 'Under Contract',
    value: 680000,
    x: 350,
    y: 500,
    connections: []
  },
  {
    id: 'prop3',
    type: 'property',
    name: '789 Pine Road',
    details: 'Investment Property',
    status: 'Available',
    value: 320000,
    x: 550,
    y: 500,
    connections: []
  },
  {
    id: 'prop4',
    type: 'property',
    name: '321 Luxury Lane',
    details: 'Luxury Penthouse',
    status: 'Available',
    value: 1200000,
    x: 750,
    y: 500,
    connections: []
  }
]

const mockConnections: RelationshipConnection[] = [
  // Agent to Lead connections
  { id: 'c1', fromId: 'agent1', toId: 'lead1', type: 'assigned', strength: 5, label: 'Primary Agent' },
  { id: 'c2', fromId: 'agent1', toId: 'lead2', type: 'assigned', strength: 4, label: 'Primary Agent' },
  { id: 'c3', fromId: 'agent2', toId: 'lead3', type: 'assigned', strength: 5, label: 'Primary Agent' },
  
  // Lead to Property connections
  { id: 'c4', fromId: 'lead1', toId: 'prop1', type: 'interested', strength: 4, label: 'Interested' },
  { id: 'c5', fromId: 'lead1', toId: 'prop2', type: 'viewing', strength: 3, label: 'Scheduled Viewing' },
  { id: 'c6', fromId: 'lead2', toId: 'prop2', type: 'offer', strength: 5, label: 'Offer Submitted' },
  { id: 'c7', fromId: 'lead2', toId: 'prop3', type: 'interested', strength: 2, label: 'Backup Option' },
  { id: 'c8', fromId: 'lead3', toId: 'prop4', type: 'viewing', strength: 4, label: 'Multiple Viewings' },
  
  // Agent to Property connections
  { id: 'c9', fromId: 'agent1', toId: 'prop1', type: 'listing', strength: 5, label: 'Listing Agent' },
  { id: 'c10', fromId: 'agent1', toId: 'prop2', type: 'selling', strength: 4, label: 'Selling Agent' },
  { id: 'c11', fromId: 'agent2', toId: 'prop3', type: 'listing', strength: 5, label: 'Listing Agent' },
  { id: 'c12', fromId: 'agent2', toId: 'prop4', type: 'listing', strength: 5, label: 'Listing Agent' }
]

interface RelationshipMapProps {
  className?: string
}

export function RelationshipMap({ className }: RelationshipMapProps) {
  const [nodes, setNodes] = useState<RelationshipNode[]>(mockNodes)
  const [connections] = useState<RelationshipConnection[]>(mockConnections)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const getNodeColor = (node: RelationshipNode) => {
    switch (node.type) {
      case 'agent':
        return 'bg-blue-500'
      case 'lead':
        return 'bg-green-500'
      case 'property':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'agent':
        return <Users className="h-4 w-4 text-white" />
      case 'lead':
        return <User className="h-4 w-4 text-white" />
      case 'property':
        return <Building className="h-4 w-4 text-white" />
      default:
        return null
    }
  }

  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'assigned':
        return '#3B82F6' // blue
      case 'interested':
        return '#10B981' // green
      case 'viewing':
        return '#F59E0B' // amber
      case 'offer':
        return '#EF4444' // red
      case 'listing':
        return '#8B5CF6' // purple
      case 'selling':
        return '#06B6D4' // cyan
      default:
        return '#6B7280' // gray
    }
  }

  const filteredNodes = nodes.filter(node => {
    if (filterType === 'all') return true
    return node.type === filterType
  })

  const filteredConnections = connections.filter(conn => {
    const fromNode = nodes.find(n => n.id === conn.fromId)
    const toNode = nodes.find(n => n.id === conn.toId)
    
    if (filterType === 'all') return true
    
    return (fromNode && filteredNodes.includes(fromNode)) || 
           (toNode && filteredNodes.includes(toNode))
  })

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId)
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelectedNode(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-blue-600" />
            <span>Relationship Map</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="agent">Agents</SelectItem>
                <SelectItem value="lead">Leads</SelectItem>
                <SelectItem value="property">Properties</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.min(z + 0.2, 2))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative h-[600px] bg-gray-50 overflow-hidden">
          {/* SVG for connections */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6B7280"
                />
              </marker>
            </defs>
            
            {filteredConnections.map((connection) => {
              const fromNode = nodes.find(n => n.id === connection.fromId)
              const toNode = nodes.find(n => n.id === connection.toId)
              
              if (!fromNode || !toNode) return null
              
              const isHighlighted = selectedNode === connection.fromId || selectedNode === connection.toId
              
              return (
                <g key={connection.id}>
                  <line
                    x1={fromNode.x + 40}
                    y1={fromNode.y + 40}
                    x2={toNode.x + 40}
                    y2={toNode.y + 40}
                    stroke={getConnectionColor(connection.type)}
                    strokeWidth={isHighlighted ? 3 : connection.strength}
                    strokeOpacity={isHighlighted ? 1 : 0.6}
                    markerEnd="url(#arrowhead)"
                  />
                  
                  {/* Connection label */}
                  {connection.label && isHighlighted && (
                    <text
                      x={(fromNode.x + toNode.x) / 2 + 40}
                      y={(fromNode.y + toNode.y) / 2 + 35}
                      textAnchor="middle"
                      className="text-xs fill-gray-700 font-medium"
                      style={{ pointerEvents: 'none' }}
                    >
                      {connection.label}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
          
          {/* Nodes */}
          <div 
            className="absolute inset-0"
            style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
          >
            {filteredNodes.map((node) => {
              const isSelected = selectedNode === node.id
              const isConnected = selectedNode && connections.some(c => 
                (c.fromId === selectedNode && c.toId === node.id) ||
                (c.toId === selectedNode && c.fromId === node.id)
              )
              
              return (
                <div
                  key={node.id}
                  className={cn(
                    "absolute cursor-pointer transition-all duration-200",
                    isSelected && "z-10 scale-110",
                    isConnected && "ring-2 ring-blue-400"
                  )}
                  style={{
                    left: node.x,
                    top: node.y,
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onClick={() => handleNodeClick(node.id)}
                >
                  {/* Node circle */}
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-2 border-white",
                    getNodeColor(node),
                    isSelected && "ring-4 ring-blue-300"
                  )}>
                    {getNodeIcon(node.type)}
                  </div>
                  
                  {/* Node label */}
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-20">
                      {node.name}
                    </div>
                    <div className="text-xs text-gray-600 truncate max-w-20">
                      {node.details}
                    </div>
                    {node.status && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {node.status}
                      </Badge>
                    )}
                    {node.value && (
                      <div className="text-xs font-medium text-green-600 mt-1">
                        {formatCurrency(node.value)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-2">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Agents</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Leads</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-600">Properties</span>
              </div>
            </div>
          </div>
          
          {/* Connection types legend */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-2">Connections</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-blue-500"></div>
                <span className="text-xs text-gray-600">Assigned</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-green-500"></div>
                <span className="text-xs text-gray-600">Interested</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-amber-500"></div>
                <span className="text-xs text-gray-600">Viewing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-red-500"></div>
                <span className="text-xs text-gray-600">Offer</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-purple-500"></div>
                <span className="text-xs text-gray-600">Listing</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Selected node details */}
        {selectedNode && (
          <div className="p-4 border-t bg-white">
            {(() => {
              const node = nodes.find(n => n.id === selectedNode)
              if (!node) return null
              
              const nodeConnections = connections.filter(c => 
                c.fromId === selectedNode || c.toId === selectedNode
              )
              
              return (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {node.name} ({node.type})
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{node.details}</p>
                  
                  {nodeConnections.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Connections ({nodeConnections.length})
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {nodeConnections.map((conn) => {
                          const otherNodeId = conn.fromId === selectedNode ? conn.toId : conn.fromId
                          const otherNode = nodes.find(n => n.id === otherNodeId)
                          
                          return (
                            <Badge key={conn.id} variant="outline" className="text-xs">
                              {otherNode?.name} ({conn.type})
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}