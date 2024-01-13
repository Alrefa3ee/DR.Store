from io import BytesIO
from PIL import Image
from django.contrib.auth.models import AbstractUser
from django.core.files import File
from django.db import models

from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    orders = models.ManyToManyField('product.Order', related_name='user_orders')    
    REQUIRED_FIELDS = ['full_name', 'phone_number', 'address', 'birth_date', 'orders']

STATUS = (
    ("Pending","Pending"),
    ("Accepted","Accepted"),
    ("Rejected","Rejected")
)

class OrderedProduct(models.Model):
    product = models.ForeignKey('product.Product', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)

class Order(models.Model):
    user = models.ForeignKey(User, related_name='user_orders', on_delete=models.CASCADE)
    ordered_products = models.ManyToManyField(OrderedProduct)
    date_ordered = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, blank=True, null=True, choices=STATUS, default="Pending")

    def __str__(self):
        return str(self.id)

class Category(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ('name',)
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return f'/{self.name}/'

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="uplouds/", blank=True, null=True)
    thumbnail = models.ImageField(upload_to="uplouds/", blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-date_added",)

    def __str__(self):
        return str(self.name)

    def get_absolute_url(self):
        return f"/{self.category.name}/{self.name}/"

    def get_image(self):
        if self.image:
            return "http://localhost:8000" + self.image.url
        return ""

    def get_thumbnail(self):
        if self.thumbnail:
            return "http://localhost:8000" + self.thumbnail.url
        else:
            if self.image:
                self.thumbnail = self.make_thumbnail(self.image)
                self.save()
                return "http://localhost:8000" + self.thumbnail.url
            else:
                return ""

    def make_thumbnail(self, image, size=(300, 200)):
        try:
            img = Image.open(image)
            img.convert("RGB")
            img.thumbnail(size)

            thumb_io = BytesIO()
            img.save(thumb_io, "JPEG", quality=99)
            thumbnail = File(thumb_io, name=image.name)

            return thumbnail
        except OSError:
            img = Image.open(image)
            img.convert("RGB")
            img.thumbnail(size)

            thumb_io = BytesIO()
            img.save(thumb_io, "PNG", quality=99)
            thumbnail = File(thumb_io, name=image.name)

            return thumbnail
        


