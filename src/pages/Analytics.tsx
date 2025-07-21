import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { blink } from '@/blink/client'
import { Lead, Property } from '@/types'
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Building, 
  DollarSign, 
  Calendar,
  Target,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react'

export function Analytics() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await blink.auth.me()
        
        const [leadsData, propertiesData] = await Promise.all([
          blink.db.leads.list({ where: { userId: user.id } }),
          blink.db.properties.list({ where: { userId: user.id } })
        ])
        
        setLeads(leadsData)
        setProperties(propertiesData)
      } catch (error) {
        console.error('Failed to load analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Calculate analytics metrics
  const totalLeads = leads.length
  const totalProperties = properties.length
  const totalPipelineValue = leads.reduce((sum, lead) => sum + (lead.budget || 0), 0)
  const avgPropertyPrice = properties.length > 0 ? properties.reduce((sum, prop) => sum + prop.price, 0) / properties.length : 0

  // Lead status breakdown
  const leadsByStatus = {
    hot: leads.filter(l => l.status.toLowerCase() === 'hot').length,
    warm: leads.filter(l => l.status.toLowerCase() === 'warm').length,
    cold: leads.filter(l => l.status.toLowerCase() === 'cold').length,
    new: leads.filter(l => l.status.toLowerCase() === 'new').length
  }

  // Property status breakdown
  const propertiesByStatus = {
    available: properties.filter(p => p.status.toLowerCase() === 'available').length,
    pending: properties.filter(p => p.status.toLowerCase().includes('pending') || p.status.toLowerCase().includes('contract')).length,
    sold: properties.filter(p => p.status.toLowerCase() === 'sold').length
  }

  // Lead sources breakdown
  const leadSources = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Property types breakdown
  const propertyTypes = properties.reduce((acc, property) => {
    acc[property.propertyType] = (acc[property.propertyType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Recent activity (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const recentLeads = leads.filter(lead => new Date(lead.createdAt) > thirtyDaysAgo).length
  const recentProperties = properties.filter(prop => new Date(prop.createdAt) > thirtyDaysAgo).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : totalLeads}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{recentLeads} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : totalProperties}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{recentProperties} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : formatCurrency(totalPipelineValue)}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Property Price</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : formatCurrency(avgPropertyPrice)}</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Lead Status Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(leadsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'hot' ? 'bg-red-500' :
                      status === 'warm' ? 'bg-yellow-500' :
                      status === 'cold' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <span className="capitalize font-medium">{status} Leads</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{count}</span>
                    <span className="text-sm text-gray-500">
                      ({totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Property Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Property Status Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(propertiesByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'available' ? 'bg-green-500' :
                      status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <span className="capitalize font-medium">{status} Properties</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{count}</span>
                    <span className="text-sm text-gray-500">
                      ({totalProperties > 0 ? Math.round((count / totalProperties) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Lead Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(leadSources)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="font-medium">{source}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / totalLeads) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Property Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Property Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(propertyTypes)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="font-medium">{type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-600 h-2 rounded-full" 
                        style={{ width: `${(count / totalProperties) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Performance Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {totalLeads > 0 ? Math.round((leadsByStatus.hot / totalLeads) * 100) : 0}%
              </div>
              <p className="text-sm text-blue-700 mt-1">Hot Lead Conversion Rate</p>
              <p className="text-xs text-gray-600 mt-2">
                {leadsByStatus.hot} out of {totalLeads} leads are hot
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {totalProperties > 0 ? Math.round((propertiesByStatus.available / totalProperties) * 100) : 0}%
              </div>
              <p className="text-sm text-green-700 mt-1">Active Listings Rate</p>
              <p className="text-xs text-gray-600 mt-2">
                {propertiesByStatus.available} out of {totalProperties} properties are active
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {totalLeads > 0 ? formatCurrency(totalPipelineValue / totalLeads) : '$0'}
              </div>
              <p className="text-sm text-purple-700 mt-1">Average Lead Value</p>
              <p className="text-xs text-gray-600 mt-2">
                Based on {totalLeads} leads with budget data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {!loading && totalLeads === 0 && totalProperties === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No data to analyze yet</h3>
                <p className="text-gray-600 mt-1">
                  Start by adding some leads and properties to see your analytics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}