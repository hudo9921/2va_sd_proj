from xml.dom import ValidationErr
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from decimal import Decimal
from .tasks import send_order_confirmation_email

class AddToCartAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        cart, created = Cart.objects.get_or_create(user=request.user)
        quantity = int(request.data.get('quantity', 1))
        
        if quantity > product.stock_quant:
            raise ValidationErr('Not enough stock for this product')
        
        product.stock_quant -= quantity
        product.save()
        
        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product, price=product.price,defaults={'quantity':quantity})
        
        if not item_created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_200_OK if not item_created else status.HTTP_201_CREATED)

class ClearCartAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
            cart.cartitem_set.all().delete()
            return Response({'message': 'carrinho limpo'}, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({'error': 'carrinho nao existe'}, status=status.HTTP_404_NOT_FOUND)
        
class GetUserCartAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartSerializer

    def get(self, request, *args, **kwargs): 
        cart = Cart.objects.get(user=request.user)
        cart_items = cart.cartitem_set.all()
        cart_serializer = self.serializer_class(cart)
        items_serializer = CartItemSerializer(cart_items, many=True)
        data = {
            "cart": cart_serializer.data,
            "items": items_serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)

class UpdateCartItemQuantityAPIView(generics.UpdateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    lookup_field  = 'id'
    def put(self, request, *args, **kwargs):
        cart_item = self.get_object()
        new_quantity = request.data.get('quantity', None)
        if (new_quantity is not None) & (new_quantity!=0):
            cart_item.quantity = new_quantity
            cart_item.save()
            serializer = self.get_serializer(cart_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Please provide a quantity'}, status=status.HTTP_400_BAD_REQUEST)

class RemoveFromCartAPIView(APIView):
    def delete(self, request, cart_item_id):
        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart__user=request.user)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CreateOrderAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, *args, **kwargs):
        user_cart = Cart.objects.get(user=request.user)
        
        if not user_cart.cartitem_set.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        order = Order.objects.create(user=user_cart.user, total_price=Decimal('0'), status='Pending')

        for cart_item in user_cart.cartitem_set.all():
            order_item = OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.price
            )
            order.total_price += order_item.price*order_item.quantity

        order.save()

        user_cart.cartitem_set.all().delete()

        serializer = OrderSerializer(order)
        
        send_order_confirmation_email.delay(order.id)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class TestEmailService(APIView):
    permission_classes = []
    
    def get(self, request, *args, **kwargs):

        order = Order.objects.all()[0]

        send_order_confirmation_email.delay(order.id)

        return Response('teste')

class GetUserOrder(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    # def get_queryset(self):
    #     user = self.request.user
    #     orders = Order.objects.filter(user=user)
    #     return orders
    
    def get(self, request):
        data = []
        for order in Order.objects.filter(user=self.request.user):
            data.append({
                'order': OrderSerializer(order).data,
                'items': OrderItemSerializer(order.orderitem_set.all(), many=True).data
            })
        return Response(data)


class GetUserOrderItems(generics.ListAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    # def get_queryset(self):
    #     user = self.request.user
    #     order_id = self.kwargs['order_id']
    #     queryset = OrderItem.objects.filter(order__id=order_id, order__user=user)
    #     return queryset
    
    def get(self, request, order_id):
        queryset = OrderItem.objects.filter(order__id=order_id, order__user=self.request.user)
        serializer = OrderItemSerializer(queryset, many=True)
        return Response(serializer.data)
        
class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title',]
    filterset_fields = ['category',]

    def get_permissions(self):
        if self.request.method != 'GET':
            self.permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        self.permission_classes = []
        return super(self.__class__, self).get_permissions()

class ProductRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'

    def get_permissions(self):
        if self.request.method != 'GET':
            self.permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        self.permission_classes = []
        return super(self.__class__, self).get_permissions()
    

class TopRatedProducts(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = []

    def get_queryset(self):
        return Product.objects.all().order_by('-rating_rate')
    

class ProductsCategories(APIView):
    permission_classes = []

    def get(self, request):
        categories = Product.objects.all().values_list('category', flat=True).distinct()
        return Response(categories, status=status.HTTP_200_OK)
