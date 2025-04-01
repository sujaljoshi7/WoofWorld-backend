import razorpay
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Razorpay client setup
client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))

# def create_order(request):
#     # Sample data (simulating the Razorpay order creation)
#     sample_order_data = {
#         "id": "order_1234567890",  # Sample Razorpay Order ID
#         "amount": 500,  # Amount in paise (50000 paise = 500 INR)
#         "currency": "INR",
#         "receipt": "order_rcptid_11",
#         "status": "created",
#     }
    
#     # Return the sample order data
#     return JsonResponse(sample_order_data)

@csrf_exempt
def create_order(request):
    if request.method == "POST":
        data = json.loads(request.body)
        event_id = data.get("event_id")
        amount = int(data.get("amount")) * 100  # Convert to paise

        try:
            # Create an order in Razorpay
            order = client.order.create({
                "amount": amount,
                "currency": "INR",
                "receipt": f"order_{event_id}",
                "payment_capture": 1,
            })
            return JsonResponse({"order_id": order["id"], "amount": amount, "currency": "INR"})
        except razorpay.errors.BadRequestError as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)
