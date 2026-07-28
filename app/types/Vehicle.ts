interface Vehicle {
  service_type: string;
   vehicle_id: 1,
  name: "",
  class: "",
  image: "",
  capacity: 0,
  rate: 0,
  base_price: 0,
  total_price: 0,
  recommended: true,
  calculation: {
    base_price: number;
    gratuity_amount: number;
    tax_amount: number;
  }
}
export type { Vehicle };