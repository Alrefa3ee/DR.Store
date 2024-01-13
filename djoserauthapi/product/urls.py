from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from product import views

urlpatterns = [
    path('latest-products/', views.LatestProductsList.as_view()),
    path('products/<str:category_name>/<str:product_name>/', views.ProductDetail.as_view()),
    path('products/<str:category_name>/', views.CategoryDetail.as_view()),
    path('categorys/', views.CategorysList.as_view()),
    path('products/', views.ProductsList.as_view()),
    path('auth/token/', TokenObtainPairView.as_view()),
    path('auth/token/refresh/', TokenRefreshView.as_view()),
    path("products/search/", views.search, name="search"),
    path("product/getById/<str:id>", views.GetProductById.as_view(), name="getProductById"),
    path("order/", views.CreateOrder.as_view(), name="createProduct"),
    path("getUserInfo/", views.GetUserInfo.as_view(), name="getUserInfo"),
    path("getOrders/", views.GetProductsDetails.as_view(), name="getOrders"),
    path("DeleteOrder/<str:id>", views.DeleteOrder.as_view(), name="deleteOrder"),
    path("updateUserInfo/", views.EditUserInfo.as_view(), name="updateOrder"),
    path("search/", views.search, name="search"),
    path("product/<str:product_pk>/rating/", views.RatingViewSet.as_view({"get": "list", "post": "create"})),
    # path('product/recommendations/', views.ProductRecommendation.as_view(), name='product_recommendations'),
]