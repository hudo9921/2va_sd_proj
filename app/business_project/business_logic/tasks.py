from celery import shared_task
from .models import *
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q
from .serializers import *
import time
import random
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import os
from django.conf import settings

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

    seller_emails = set()
    for item in order.orderitem_set.select_related('product__seller'):
        if item.product.seller and item.product.seller.email:
            seller_emails.add(item.product.seller.email)

    if seller_emails:
        seller_subject = f'You have a new sale - Order #{order.id}'
        seller_message = f"A customer has purchased your product(s)."
        send_mail(
            seller_subject,
            seller_message,
            settings.EMAIL_HOST_USER,
            list(seller_emails)
        )


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
    

@shared_task
def product_rating_manager():
    for prod in Product.objects.all():
        prod.rating_rate = round(random.uniform(0.0, 5.0), 1)
        prod.save()


@shared_task
def generate_products_pdf_task(user_id, category, festivity, filename="products_report.pdf"):
    u = User.objects.get(cpf=user_id)

    path = os.path.join(settings.MEDIA_ROOT, "pdfs")
    os.makedirs(path, exist_ok=True)

    filepath = os.path.join(path, filename)
    p = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4

    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, "Lista de Produtos")

    y = height - 80
    p.setFont("Helvetica", 12)

    query_set = Product.objects.filter(Q(~Q(stock_quant=0) & Q(seller__cpf=u.cpf)))

    if category:
        query_set = query_set.filter(category=category)

    if festivity:
        query_set = query_set.filter(festivity=festivity)

    for product in query_set:
        line = f"{product.title} | Preço: R$ {product.price}"
        p.drawString(50, y, line)
        y -= 20
        if y < 50:
            p.showPage()
            y = height - 50
            p.setFont("Helvetica", 12)

    p.showPage()
    p.save()

    return f"/media/pdfs/{filename}"
