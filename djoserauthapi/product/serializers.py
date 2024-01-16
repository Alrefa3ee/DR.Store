from rest_framework import serializers

from .models import Category, Product , Order , OrderedProduct , Rating
from django.contrib.auth import get_user_model

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "username",
            "email",
            "password",
            "full_name",
            "birth_date",
            "phone_number",
            "address",
            

        )
        extra_kwargs = {"password": {"write_only": True}}


class AddProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    quantity = serializers.IntegerField()

class OrderedProductSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = OrderedProduct
        fields = (
            "id",
            "product",
            "quantity",
        )

class OrderSerializer(serializers.ModelSerializer):
    ordered_products = OrderedProductSerializer(many=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "user",
            "ordered_products",
            "date_ordered",
            "status",
        )

    def create(self, validated_data):
            ordered_products_data = validated_data.get('ordered_products', [])
            order = Order.objects.create(**validated_data)

            for ordered_product_data in ordered_products_data:
                product_id = ordered_product_data['product'].id
                quantity = ordered_product_data['quantity']

                try:
                    product = Product.objects.get(id=product_id)
                    ordered_product = OrderedProduct.objects.create(product=product, quantity=quantity)
                    order.ordered_products.add(ordered_product)
                except Product.DoesNotExist:
                    print(f"Product with ID {product_id} does not exist.")
                    raise serializers.ValidationError(f"Product with ID {product_id} does not exist.")
                except Exception as e:
                    print(f"Error creating ordered product: {e}")
                    raise serializers.ValidationError("Error creating ordered product.")

            return order

class PCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "get_absolute_url",
        )

class ProductSerializer(serializers.ModelSerializer):
    category = PCategorySerializer()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "description",
            "price",
            "get_image",
            "get_thumbnail",
            "date_added",
            "category",
        )


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "get_absolute_url",
            "products",
        )

class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "get_absolute_url",
        )



class GetUserInfoSerializer(serializers.ModelSerializer):
    user_orders = OrderSerializer(many=True, read_only=True)

    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "username",
            "email",
            "full_name",
            "birth_date",
            "phone_number",
            "address",
            "user_orders"
        )


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["id", "rating", "description"]
    
    def create(self, validated_data):
        product_id = self.context["product_id"]
        user_id = self.context["user_id"]
        rating = Rating.objects.create(product_id = product_id, user_id=user_id, **self.validated_data)
        return rating
    

class RecommendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

