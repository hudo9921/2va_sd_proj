import os
import json
from business_logic.models import Product
import random

import os
import json
from business_logic.models import Product

# # Get the absolute path to the file
# file_path = os.path.abspath('items.json')

# # Open the file using the absolute file path
# with open('business_logic/items.json', 'r') as f:
#     data = json.load(f)

# for item in data:
#     # Get the values for the new object
#     title = item['title']
#     id = item['id']
#     price = item['price']
#     description = item['description']
#     category = item['category']
#     image = item['image']
#     rating_rate =item['rating']['rate']
#     rating_count = item['rating']['count']
#     # Try to get an existing object with the same name
#     obj, created = Product.objects.get_or_create(
#         id=id,
#         defaults={'price':price,'description':description,'category':category,'image':image,'title':title,'rating_count':rating_count,'rating_rate':rating_rate})

for prod in Product.objects.all():
    prod.stock_quant = random.randint(3,10)
    prod.save()