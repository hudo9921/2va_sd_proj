from celery import shared_task
from .models import *
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q
from .serializers import *
import time
import random

@shared_task
def test():
    # essa request precisa retornar todos os objetos perfis
    return "\n TESTE \n"

@shared_task
def send_order_confirmation_email(order_id):
    order = Order.objects.get(id=order_id)
    serializer = OrderItemSerializer()

    items = '\nOrdem Items List:'

    for x in order.orderitem_set.all():
        items += f"\nproduct: {x.product.title}. | quantity: {x.quantity}. | price: {x.quantity*x.price}."

    subject = f'Order Confirmation - Order #{order.id}'
    message = f'Thank you for your order! Your order number is {order.id}.\n{items}'
    recipient_list = [order.user.email]
    send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)

@shared_task
def order_manager():
    order = Order.objects.filter(~Q(status="Delivered")).first()
    if order:
        time.sleep(random.randint(15, 20))

        old_status = order.status

        order.status = "Sent" if order.status == 'Pending' else 'Delivered'
        order.save()

        return f"\nOrder {order.id} processed. Status: {old_status}->{order.status}\n"
    else:
        return "No order to process."
