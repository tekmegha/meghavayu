export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  imageUrl?: string; // Optional, if you want to add specific images for stores later
  brand_id: string; // Brand identifier for multi-brand support
}
