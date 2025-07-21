import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreatePropertyForm } from '@/components/forms/CreatePropertyForm'
import { blink } from '@/blink/client'
import { Property } from '@/types'
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Bed, 
  Bath,
  Square,
  DollarSign,
  Eye,
  Heart,
  MoreHorizontal,
  Building
} from 'lucide-react'

// Mock properties data
const mockProperties = [
  {
    id: '1',
    title: 'Modern Downtown Condo',
    address: '123 Oak Street, Downtown',
    price: 450000,
    propertyType: 'Condo',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'],
    description: 'Beautiful modern condo with city views and premium amenities.',
    listingDate: '2024-01-15',
    views: 45,
    favorites: 8
  },
  {
    id: '2',
    title: 'Family Home with Garden',
    address: '456 Maple Avenue, Suburbs',
    price: 680000,
    propertyType: 'House',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2400,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'],
    description: 'Spacious family home with large garden and excellent schools nearby.',
    listingDate: '2024-01-10',
    views: 78,
    favorites: 15
  },
  {
    id: '3',
    title: 'Investment Opportunity',
    address: '789 Pine Road, East Side',
    price: 320000,
    propertyType: 'Duplex',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    status: 'pending',
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'],
    description: 'Great investment property with rental income potential.',
    listingDate: '2024-01-08',
    views: 32,
    favorites: 5
  },
  {
    id: '4',
    title: 'Luxury Waterfront Villa',
    address: '321 Ocean Drive, Waterfront',
    price: 1200000,
    propertyType: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3500,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'],
    description: 'Stunning waterfront villa with private beach access.',
    listingDate: '2024-01-20',
    views: 156,
    favorites: 32
  }
]

export function Properties() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  // Load properties from database
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const user = await blink.auth.me()
        const propertiesData = await blink.db.properties.list({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        })
        setProperties(propertiesData)
      } catch (error) {
        console.error('Failed to load properties:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  const handlePropertyCreated = (newProperty: Property) => {
    setProperties(prev => [newProperty, ...prev])
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus
    const matchesType = selectedType === 'all' || property.propertyType.toLowerCase() === selectedType.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage your property listings and track performance</p>
        </div>
        <CreatePropertyForm onPropertyCreated={handlePropertyCreated} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {loading ? '...' : properties.filter(p => p.status.toLowerCase() === 'available').length}
              </p>
              <p className="text-sm text-gray-600">Active Listings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {loading ? '...' : properties.filter(p => p.status.toLowerCase().includes('pending') || p.status.toLowerCase().includes('contract')).length}
              </p>
              <p className="text-sm text-gray-600">Pending Sales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {loading ? '...' : properties.filter(p => p.status.toLowerCase() === 'sold').length}
              </p>
              <p className="text-sm text-gray-600">Sold Properties</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {loading ? '...' : properties.length > 0 ? formatCurrency(properties.reduce((sum, p) => sum + p.price, 0) / properties.length) : '$0'}
              </p>
              <p className="text-sm text-gray-600">Avg. Property Price</p>
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
                  placeholder="Search properties by title or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'pending', 'sold'].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="capitalize"
                >
                  {status === 'all' ? 'All' : status}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {['all', 'house', 'condo', 'villa', 'duplex'].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="capitalize"
                >
                  {type === 'all' ? 'All Types' : type}
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

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
            {/* Property Image */}
            <div className="relative h-48 bg-gray-200">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <Building className="h-16 w-16 text-blue-300" />
                </div>
              )}
              <div className="absolute top-3 left-3">
                <Badge className={getStatusColor(property.status)}>
                  {property.status}
                </Badge>
              </div>
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-3 left-3">
                <div className="text-2xl font-bold text-white drop-shadow-lg">
                  {formatCurrency(property.price)}
                </div>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg leading-tight">{property.title}</CardTitle>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Property Details */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  {property.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{property.bedrooms} bed</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{property.bathrooms} bath</span>
                    </div>
                  )}
                  {property.squareFeet && (
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{property.squareFeet.toLocaleString()} sqft</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Type */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {property.propertyType}
                </Badge>
                <div className="text-xs text-gray-500">
                  Listed {new Date(property.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 line-clamp-2">{property.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Edit Listing
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
                <p className="text-gray-600 mt-1">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first property listing'}
                </p>
              </div>
              <CreatePropertyForm 
                onPropertyCreated={handlePropertyCreated}
                trigger={
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Property
                  </Button>
                } 
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}