from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.decorators import api_view

from surprise import Dataset, Reader
from surprise.model_selection import train_test_split
from surprise import KNNBasic
import pandas as pd

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication


from .models import Product, Category, OrderedProduct, Order, Rating
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    CategoryListSerializer,
    OrderSerializer,
    GetUserInfoSerializer,
    RatingSerializer,
)


class LatestProductsList(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        products = Product.objects.all()[0:3]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class RatingViewSet(ModelViewSet):
    # queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(self.kwargs["product_pk"])
        return Rating.objects.filter(product_id=self.kwargs["product_pk"])

    def get_serializer_context(self):
        user_id = self.request.user.id
        product_id = self.kwargs["product_pk"]
        print(user_id)
        return {"user_id": user_id, "product_id": product_id}


class ProductDetail(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, category_name, product_name):
        try:
            return Product.objects.filter(category__name=category_name).get(
                name=product_name
            )
        except Product.DoesNotExist:
            raise Http404

    def get(self, request, category_name, product_name, format=None):
        product = self.get_object(category_name, product_name)
        serializer = ProductSerializer(product)
        return Response(serializer.data)


class CategoryDetail(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, category_name):
        try:
            return Category.objects.get(slug=category_name)
        except Category.DoesNotExist:
            raise Http404

    def get(self, request, category_name, format=None):
        category = self.get_object(category_name)
        serializer = CategorySerializer(category)
        return Response(serializer.data)


class CategorysList(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        categorys = Category.objects.all()
        serializer = CategoryListSerializer(categorys, many=True)
        return Response(serializer.data)


class ProductsList(APIView, PageNumberPagination):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    page_size = 10
    page_query_param = "page"
    page_size_query_param = "page_size"
    max_page_size = 10

    def get(self, request):
        products = Product.objects.all()
        result = self.paginate_queryset(products, request, view=self)
        serializer = ProductSerializer(result, many=True)
        return self.get_paginated_response(serializer.data)


class GetProductById(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        product = Product.objects.get(id=id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)


class CreateOrder(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        print(request.data)
        print("-" * 90)
        # Use the updated OrderSerializer with nested OrderedProductSerializer
        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            print(serializer.validated_data)
            # Extract ordered_products_data from validated_data
            ordered_products_data = serializer.validated_data.pop("ordered_products")

            # Create the order without saving it yet
            order = serializer.save(user=request.user)

            # Loop through ordered_products_data and create OrderedProduct instances
            for ordered_product_data in ordered_products_data:
                product_id = ordered_product_data["product"].id
                quantity = ordered_product_data["quantity"]

                # Fetch the corresponding product
                product = Product.objects.get(id=product_id)

                # Create and associate OrderedProduct with the order
                ordered_product = OrderedProduct.objects.create(
                    product=product, quantity=quantity
                )
                order.ordered_products.add(ordered_product)

            # Save the order with associated OrderedProduct instances
            order.save()

            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserInfo(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = GetUserInfoSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteOrder(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        order = Order.objects.get(id=id)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GetProductsDetails(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        product_ids_list = request.data

        products_details = []

        for product_ids in product_ids_list:
            products = Product.objects.filter(id__in=product_ids)

            serializer = ProductSerializer(products, many=True)

            products_details.append(serializer.data)

        return Response(products_details, status=status.HTTP_200_OK)


class EditUserInfo(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request, *args, **kwargs):
        print(
            request.data
        )  # {'full_name': 'Abdulmajed AL RIFAI', 'username': 'admin', 'phone_number': None, 'email': 'alrefa3ee.abd@gmail.com', 'address': 'Alnaseer Street, jordan 1'}
        print("_" * 90)

        user = request.user
        print(user)
        print("_" * 90)
        serializer = GetUserInfoSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def search(request):
    query = request.query_params.get("q")

    if query:
        print(query)
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(category__name__exact=query)
        )
        print(products)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    else:
        return Response({"products": []})



class ProductRecommendation(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # get the pruduct id for the max rating user 
        max_rating_user = Rating.objects.filter(user_id=request.user.id).order_by('-rating')[0].product_id
        print(max_rating_user)

        ratings = Rating.objects.filter(product_id=max_rating_user)
        print(ratings)
        ratings_df = pd.DataFrame(
            list(ratings.values("user__id", "product__id", "rating"))
        )  
        reader = Reader(rating_scale=(1, 5))
        data = Dataset.load_from_df(
            ratings_df[["user__id", "product__id", "rating"]], reader
        ) 
        trainset, testset = train_test_split(data, test_size=0.25)

        sim_options = {"name": "cosine", "user_based": True}
        algo = KNNBasic(sim_options=sim_options)

        algo.fit(trainset)

        all_product_ids = list(Product.objects.values_list("id", flat=True))
        # all_product_ids.remove(product_id)

        recommendations = []
        for other_product_id in all_product_ids:
            prediction = algo.predict(request.user.id, other_product_id)
            recommendations.append(
                {"product_id": other_product_id, "predicted_rating": prediction.est}
            )
        recommendations.sort(key=lambda x: x["predicted_rating"], reverse=True)
        products = []
        for i in recommendations[:5]:
            products.append(Product.objects.get(id=i["product_id"]))
        print(products[0].get_image)
        serializer = ProductSerializer(products, many=True)
        return Response({"recommendations": serializer.data })
