/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  vehicle: any;
}

const SelectVehiclePriceBreakdown = ({ vehicle }: Props) => {
  const calculation = vehicle?.calculation;

  const basePrice = calculation?.base_price || 0;
  const extrasPrice = calculation?.extras_price || 0;
  const airportFees = calculation?.airport_fees || 0;
  const congestionCharge = calculation?.congestion_charge || 0;
  const parking = calculation?.parking || 0;
  const others = calculation?.others || 0;
  const tolls = calculation?.tolls || 0;
  const extraStops = calculation?.extra_stops || 0;
  const extraStopAmount = calculation?.extra_stop_amount || 0;
  const waitingMinutes = calculation?.waiting_minutes || 0;
  const waitingTimeAmount = calculation?.waiting_time_amount || 0;
  const ratePrice = calculation?.rate || 0;
  const kilometers = calculation?.km || 0;
  const tripFare = calculation?.trip_fare || 0;
  const subtotal = calculation?.subtotal || 0;
  const surgeRatePercent = calculation?.surge_rate_percent || 0;
  const surgeRateAmount = calculation?.surge_rate_amount || 0;
  const taxesPercent = calculation?.tax_rate_percent || 0;
  const taxesAmount = calculation?.tax_amount || 0;
  const gratuityPercent = calculation?.gratuity_percent || 0;
  const gratuityAmount = calculation?.gratuity_amount || 0;
  const rateBufferPercent = calculation?.rate_buffer_percent || 0;
  const rateBufferAmount = calculation?.rate_buffer_amount || 0;
  const cancellationFee = calculation?.cancellation_fee || 0;
  const totalPrice = calculation?.total_price || 0;
  const authorizationAmount = calculation?.authorization_amount || 0;
  const totalHours  = calculation?.hours || 0;

  if (!vehicle) return null;

  return (
    <div className="border rounded-lg p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-5">Price Breakdown</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Base Price */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Base Price</p>
          <p className="font-semibold">${basePrice.toFixed(2)}</p>
        </div>

        {/* Rate */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Rate</p>
          <p className="font-semibold">${ratePrice.toFixed(2)}</p>
        </div>

        {/* Trip Fare */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Trip Fare</p>
          <p className="font-semibold">${tripFare.toFixed(2)}</p>
        </div>

        {/* Extras */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Extras Price</p>
          <p className="font-semibold">${extrasPrice.toFixed(2)}</p>
        </div>

        {/* Airport Fees */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Airport Fees</p>
          <p className="font-semibold">${airportFees.toFixed(2)}</p>
        </div>

        {/* Congestion */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Congestion Charge</p>
          <p className="font-semibold">${congestionCharge.toFixed(2)}</p>
        </div>

        {/* Parking */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Parking</p>
          <p className="font-semibold">${parking.toFixed(2)}</p>
        </div>

        {/* Others */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Others</p>
          <p className="font-semibold">${others.toFixed(2)}</p>
        </div>

        {/* Tolls */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Tolls</p>
          <p className="font-semibold">${tolls.toFixed(2)}</p>
        </div>

        {/* Extra Stops */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Extra Stops</p>
          <p className="font-semibold">{extraStops}</p>
        </div>

        {/* Extra Stop Amount */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Extra Stop Amount</p>
          <p className="font-semibold">${extraStopAmount.toFixed(2)}</p>
        </div>

        {/* Waiting Minutes */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Waiting Minutes</p>
          <p className="font-semibold">{waitingMinutes.toFixed(2)} min</p>
        </div>

        {/* Waiting Time Amount */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Waiting Time Amount</p>
          <p className="font-semibold">${waitingTimeAmount.toFixed(2)}</p>
        </div>

        {/* Surge Rate */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Surge Rate</p>
          <p className="font-semibold">{surgeRatePercent.toFixed(2)}%</p>
        </div>

        {/* Surge Amount */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Surge Amount</p>
          <p className="font-semibold">${surgeRateAmount.toFixed(2)}</p>
        </div>

        {/* Tax Rate */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Tax Rate</p>
          <p className="font-semibold">{taxesPercent.toFixed(2)}%</p>
        </div>

        {/* Tax Amount */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Tax Amount</p>
          <p className="font-semibold">${taxesAmount.toFixed(2)}</p>
        </div>

        {/* Gratuity Rate */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Gratuity Rate</p>
          <p className="font-semibold">{gratuityPercent.toFixed(2)}%</p>
        </div>

        {/* Gratuity Amount */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Gratuity Amount</p>
          <p className="font-semibold">${gratuityAmount.toFixed(2)}</p>
        </div>

          {
              totalHours > 0 && (
              <div>
                  <p className="text-muted-foreground">Hourly Rate</p>
                  <p className="font-medium">
                    {totalHours ? `$${totalHours.toFixed(2)}` : "$0.00"}
                  </p>
                </div>
              )

            }

        {/* Rate Buffer */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Rate Buffer</p>
          <p className="font-semibold">{rateBufferPercent.toFixed(2)}%</p>
        </div>

        {/* Rate Buffer Amount */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Rate Buffer Amount</p>
          <p className="font-semibold">${rateBufferAmount.toFixed(2)}</p>
        </div>

        {/* Cancellation Fee */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Cancellation Fee</p>
          <p className="font-semibold">${cancellationFee.toFixed(2)}</p>
        </div>

        {/* Kilometers */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Distance</p>
          <p className="font-semibold">{kilometers.toFixed(2)} km</p>
        </div>

        {/* Subtotal */}
        <div className="rounded-md border p-3">
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <p className="font-semibold">${subtotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Total Section */}
      <div className="mt-5 pt-5 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-md border p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">Total Price</p>
            <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
          </div>

          <div className="rounded-md border p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">Authorization Amount</p>
            <p className="text-xl font-bold">${authorizationAmount.toFixed(2)}</p>
          </div>

          <div className="rounded-md border p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">Distance</p>
            <p className="text-xl font-bold">{kilometers.toFixed(2)} km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectVehiclePriceBreakdown;