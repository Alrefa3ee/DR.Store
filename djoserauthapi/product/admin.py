from django.contrib import admin

from .models import *

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(User)
admin.site.register(Order)  
admin.site.register(OrderedProduct)
admin.site.register(Rating)
