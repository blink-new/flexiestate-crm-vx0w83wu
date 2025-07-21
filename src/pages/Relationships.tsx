import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RelationshipMap } from '@/components/visualizations/RelationshipMap'
import { 
  Network, 
  Users, 
  Building, 
  User, 
  ArrowRight,
  TrendingUp,
  Activity,
  Target
} from 'lucide-react'

// Mock relationship stats
const relationshipStats = {
  totalConnections: 156,
  activeRelationships: 89,
  strongConnections: 34,
  weeklyGrowth: 12
}

// Mock relationship insights
const relationshipInsights = [
  {
    id: '1',
    type: 'agent_performance',
    title: 'Top Performing Agent',
    description: 'John Doe has the highest number of active lead relationships',
    value: '23 active leads',
    trend: 'up',
    color: 'text-green-600'
  },
  {
    id: '2',
    type: 'property_interest',
    title: 'Most Popular Property',
    description: 'Luxury Waterfront Villa has the most lead interest',
    value: '8 interested leads',
    trend: 'up',
    color: 'text-blue-600'
  },
  {
    id: '3',
    type: 'conversion_rate',
    title: 'Best Conversion Path',
    description: 'Referral leads have the highest conversion rate',
    value: '78% conversion',
    trend: 'up',
    color: 'text-purple-600'
  },
  {
    id: '4',
    type: 'relationship_strength',
    title: 'Strongest Relationships',
    description: 'Agent-Lead relationships show highest engagement',
    value: '4.2/5 avg strength',
    trend: 'stable',
    color: 'text-amber-600'
  }
]

// Mock recent relationship activities
const recentActivities = [
  {
    id: '1',
    type: 'new_connection',
    description: 'Sarah Johnson connected to 123 Oak Street property',
    timestamp: '2 hours ago',
    participants: ['Sarah Johnson', '123 Oak Street']
  },
  {
    id: '2',
    type: 'relationship_strengthened',
    description: 'Mike Chen upgraded to "Offer Submitted" status',
    timestamp: '4 hours ago',
    participants: ['Mike Chen', 'John Doe']
  },
  {
    id: '3',
    type: 'new_lead_assigned',
    description: 'Jennifer Smith assigned to Jane Smith (agent)',
    timestamp: '6 hours ago',
    participants: ['Jennifer Smith', 'Jane Smith']
  },
  {
    id: '4',
    type: 'property_interest',
    description: 'David Wilson showed interest in Luxury Penthouse',
    timestamp: '8 hours ago',
    participants: ['David Wilson', 'Luxury Penthouse']
  }
]

export function Relationships() {
  const [activeTab, setActiveTab] = useState('map')

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_connection':
        return <ArrowRight className="h-4 w-4 text-blue-600" />
      case 'relationship_strengthened':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'new_lead_assigned':
        return <Users className="h-4 w-4 text-purple-600" />
      case 'property_interest':
        return <Building className="h-4 w-4 text-amber-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relationships</h1>
          <p className="text-gray-600 mt-1">Visualize and manage connections between leads, properties, and agents</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Target className="h-4 w-4 mr-2" />
            Analyze Patterns
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Network className="h-4 w-4 mr-2" />
            Export Network
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Connections</p>
                <p className="text-2xl font-bold text-gray-900">{relationshipStats.totalConnections}</p>
              </div>
              <Network className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Relationships</p>
                <p className="text-2xl font-bold text-gray-900">{relationshipStats.activeRelationships}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Strong Connections</p>
                <p className="text-2xl font-bold text-gray-900">{relationshipStats.strongConnections}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekly Growth</p>
                <p className="text-2xl font-bold text-gray-900">+{relationshipStats.weeklyGrowth}</p>
              </div>
              <ArrowRight className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map">Relationship Map</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
        </TabsList>

        {/* Relationship Map Tab */}
        <TabsContent value="map" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Map */}
            <div className="lg:col-span-3">
              <RelationshipMap />
            </div>
            
            {/* Map Controls & Info */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Map Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Node Types</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-600">Agents</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600">Leads</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-gray-600">Properties</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Interaction Tips</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Click nodes to highlight connections</li>
                      <li>• Use filters to focus on specific types</li>
                      <li>• Zoom and pan to explore details</li>
                      <li>• Hover for relationship labels</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Agents</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Leads</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Properties</span>
                    <span className="text-sm font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Connections</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relationshipInsights.map((insight) => (
              <Card key={insight.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                      <div className={`text-lg font-bold ${insight.color}`}>
                        {insight.value}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {insight.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {insight.trend === 'stable' && <Activity className="h-4 w-4 text-gray-600" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Relationship Patterns */}
          <Card>
            <CardHeader>
              <CardTitle>Relationship Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-900">Agent-Lead Relationships</h4>
                    <p className="text-sm text-blue-700">Strong one-to-many connections with high engagement</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Optimal</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-green-900">Lead-Property Interest</h4>
                    <p className="text-sm text-green-700">Multiple leads showing interest in premium properties</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Growing</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-amber-900">Cross-Agent Collaboration</h4>
                    <p className="text-sm text-amber-700">Opportunities for increased agent-to-agent referrals</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Potential</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Feed Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Relationship Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        <div className="flex space-x-1">
                          {activity.participants.map((participant, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}