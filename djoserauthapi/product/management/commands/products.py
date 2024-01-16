from django.core.management.base import BaseCommand
from product.models import Rating, Product, Category , User
from decimal import Decimal
import random
import json


class Command(BaseCommand):
    help = "My shiny new management command."

    def handle(self, *args, **options):
        for i in range(5, 10):
            for product in Product.objects.all():
                Rating.objects.create(
                    product=product,
                    user=User.objects.get(id=i),
                    rating=random.randint(1, 5),
                )
        self.stdout.write(self.style.SUCCESS("Data imported successfully"))