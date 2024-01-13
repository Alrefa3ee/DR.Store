from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework import authentication

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404



from .models import Product, Category, OrderedProduct, Order, User, Rating
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


# class ProductRecommendation(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         user_ratings = Rating.objects.filter(user=request.user)

#         reader = Reader(rating_scale=(1, 5))
#         data = Dataset.load_from_df(
#             user_ratings[["user_id", "product_id", "rating"]], reader
#         )
#         trainset = data.build_full_trainset()

#         model = SVD()
#         model.fit(trainset)

#         unrated_products = Product.objects.exclude(
#             id__in=user_ratings.values_list("product_id", flat=True)
#         )

#         recommendations = []
#         for product in unrated_products:
#             predicted_rating = model.predict(request.user.id, product.id).est
#             recommendations.append(
#                 {"product_id": product.id, "predicted_rating": predicted_rating}
#             )

#         recommendations.sort(key=lambda x: x["predicted_rating"], reverse=True)

#         top_recommendations = recommendations[:5]

#         serializer = RatingSerializer(data=top_recommendations, many=True)
#         serializer.is_valid()

#         return Response(serializer.data)
