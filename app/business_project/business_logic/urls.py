from django.urls import path
from .views import *



urlpatterns = [
    path('cart/add-to-cart/<int:product_id>', AddToCartAPIView.as_view(), name='add_to_cart'),
    path('cart/<int:id>', UpdateCartItemQuantityAPIView.as_view(), name='update_quant_item'),
    path('cart/remove/<int:cart_item_id>', RemoveFromCartAPIView.as_view(), name='remove_from_cart'),
    path('cart/clear', ClearCartAPIView.as_view(),name='clear_cart'),
    path('cart/', GetUserCartAPIView.as_view(),name='get_cart'),
    path('product/', ProductListCreate.as_view(), name='product_lc'),
    path('product/categories', ProductsCategories.as_view(), name='product_categories'),
    path('product/<int:id>', ProductRetrieveUpdateDestroy.as_view(), name='product_rud'),
    path('product/top_rated_products', TopRatedProducts.as_view(), name='top_rated_products'),
    path('orders/', GetUserOrder.as_view(), name='get_user_order'),
    path('orders/<int:order_id>', GetUserOrderItems.as_view(), name='get_user_order_items'),
    path('orders/create/', CreateOrderAPIView.as_view(), name='create-order'),
    path('test/', TestEmailService.as_view(), name=''),
]