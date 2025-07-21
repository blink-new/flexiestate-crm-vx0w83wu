import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Building, MapPin, DollarSign, Home, Bed, Bath, Square } from 'lucide-react'
import { Property } from '@/types'
import { blink } from '@/blink/client'
import toast from 'react-hot-toast'

interface CreatePropertyFormProps {
  onPropertyCreated?: (property: Property) => void
  trigger?: React.ReactNode
}

const propertyTypes = [
  'Single Family Home',
  'Condo',
  'Townhouse',
  'Multi-Family',
  'Land',
  'Commercial',
  'Investment',
  'Luxury',
  'Other'
]

const propertyStatuses = [
  'Available',
  'Under Contract',
  'Sold',
  'Off Market',
  'Coming Soon',
  'Price Reduced',
  'Contingent',
  'Pending'
]

export function CreatePropertyForm({ onPropertyCreated, trigger }: CreatePropertyFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    description: '',
    status: 'Available',
    features: [] as string[]
  })
  const [newFeature, setNewFeature] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.address || !formData.price || !formData.propertyType) {
        toast.error('Please fill in all required fields')
        return
      }

      // Create the property object
      const propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'userId'> = {
        title: formData.title,
        address: formData.address,
        price: parseFloat(formData.price),
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : undefined,
        squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : undefined,
        description: formData.description || undefined,
        status: formData.status,
        images: [] // Would be populated when images are uploaded
      }

      // Get current user
      const user = await blink.auth.me()

      // Save to the database
      const newProperty = await blink.db.properties.create({
        title: formData.title,
        address: formData.address,
        price: parseFloat(formData.price),
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : null,
        description: formData.description || null,
        status: formData.status,
        userId: user.id
      })

      console.log('Created property:', newProperty)
      toast.success('Property created successfully!')
      
      // Call the callback if provided
      onPropertyCreated?.(newProperty)
      
      // Reset form and close modal
      setFormData({
        title: '',
        address: '',
        price: '',
        propertyType: '',
        bedrooms: '',
        bathrooms: '',
        squareFeet: '',
        description: '',
        status: 'Available',
        features: []
      })
      setOpen(false)
      
    } catch (error) {
      console.error('Failed to create property:', error)
      toast.error('Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }))
  }

  const formatCurrency = (value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(num)
  }

  const defaultTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700">
      <Plus className="h-4 w-4 mr-2" />
      New Property
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-blue-600" />
            <span>Create New Property</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Beautiful 3BR Family Home"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Address *</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter full property address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Price *</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Enter price"
                  min="0"
                  step="1000"
                  required
                />
                {formData.price && (
                  <p className="text-sm text-gray-600">
                    {formatCurrency(formData.price)}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="propertyType" className="flex items-center space-x-1">
                  <Home className="h-4 w-4" />
                  <span>Property Type *</span>
                </Label>
                <Select value={formData.propertyType} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="flex items-center space-x-1">
                  <Bed className="h-4 w-4" />
                  <span>Bedrooms</span>
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                  placeholder="Number of bedrooms"
                  min="0"
                  max="20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="flex items-center space-x-1">
                  <Bath className="h-4 w-4" />
                  <span>Bathrooms</span>
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                  placeholder="Number of bathrooms"
                  min="0"
                  max="20"
                  step="0.5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="squareFeet" className="flex items-center space-x-1">
                  <Square className="h-4 w-4" />
                  <span>Square Feet</span>
                </Label>
                <Input
                  id="squareFeet"
                  type="number"
                  value={formData.squareFeet}
                  onChange={(e) => setFormData(prev => ({ ...prev, squareFeet: e.target.value }))}
                  placeholder="Total square footage"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {propertyStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Features & Amenities</h3>
            
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature (e.g., Pool, Garage, Fireplace)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="flex items-center space-x-1">
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the property, its unique features, neighborhood, etc..."
              rows={4}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}