export interface RealEstateProperty {
  id: string
  property_name: string
  location: string
  property_type: string
  area_sqft: number
  purchase_price: number
  current_value?: number
  purchase_date: string
  rental_income?: number
  maintenance_cost?: number
  created_date: string
}

export class RealEstate {
  static async list(sortBy = "-created_date"): Promise<RealEstateProperty[]> {
    const stored = localStorage.getItem("real_estate_properties")
    if (!stored) return []

    const properties = JSON.parse(stored)
    return properties.sort((a: RealEstateProperty, b: RealEstateProperty) => {
      if (sortBy === "-created_date") {
        return new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      }
      return 0
    })
  }

  static async create(data: Omit<RealEstateProperty, "id" | "created_date">): Promise<RealEstateProperty> {
    const property: RealEstateProperty = {
      ...data,
      id: Date.now().toString(),
      created_date: new Date().toISOString(),
    }

    const existing = await this.list()
    const updated = [...existing, property]
    localStorage.setItem("real_estate_properties", JSON.stringify(updated))

    return property
  }

  static async delete(id: string): Promise<void> {
    const existing = await this.list()
    const filtered = existing.filter((p) => p.id !== id)
    localStorage.setItem("real_estate_properties", JSON.stringify(filtered))
  }
}
