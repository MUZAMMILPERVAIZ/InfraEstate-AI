#!/usr/bin/env python3
"""
1) Download a pool of 25 house images once (images/house_1.jpg … images/house_25.jpg)
2) Load zameen_2025.csv, and for each row pick a random local image
3) Insert into MongoDB, storing the local image path
"""

import os
import random
import requests
from datetime import datetime
import pandas as pd
from pymongo import MongoClient

# --- Configuration ---
CSV_FILE     = 'zameen_2025.csv'
IMAGES_DIR   = 'images'
NUM_IMAGES   = 25
MONGO_URI    = "mongodb://localhost:27017/"
DB_NAME      = "infra_estate_ai"
COLLECTION   = "properties"
OWNER_EMAIL  = "muzammilpervaiz45@gmail.com"


local_images = [
    "images/house-1.jpg",
    "images/house-2.jpg",
    "images/house-3.jpg",
    'images/house-4.jpg',
    'images/house-5.jpg',
    'images/house-6.jpg',
    'images/house-7.jpg',
    'images/house-8.jpg',
    'images/house-9.jpg',
    'images/house-10.jpg',
    'images/house-11.jpg',
    'images/house-12.jpg',
    'images/house-13.jpg',
    'images/house-14.jpg',
    'images/house-15.jpg',
    'images/house-16.jpg',
    'images/house-17.jpg',
    'images/house-18.jpg',
    'images/house-19.jpg',
    'images/house-20.jpg',
]

# # --- MongoDB setup ---
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
props = db[COLLECTION]

# --- Load CSV and insert documents ---
df = pd.read_csv(CSV_FILE)

# For each city, take a sample of up to 3000 rows
def limit_group(group, n=3000):
    return group.sample(n=n, replace=False) if len(group) > n else group

df_limited = (
    df.groupby('city', group_keys=False)
      .apply(limit_group, n=3000)
      .reset_index(drop=True)
)

print(f"Total rows after limiting: {len(df_limited)}")

for idx, row in df_limited.iterrows():
    # if index >= 20000:
    #     break

    # pick a random local image path
    chosen_path = random.choice(local_images)

    doc = {
        "city":         row.get("city"),
        "location":     row.get("location"),
        "price":        float(row.get("price", 0)),
        "size":         float(row.get("size", 0)),
        "bedrooms":     int(row.get("bedrooms", 0)),
        "baths":        int(row.get("baths", 0)),
        "year":         datetime.utcnow().year,
        "type":         "residential",
        "image_link":   chosen_path,
        "owner_email":  OWNER_EMAIL,
        "created_at":   datetime.utcnow()
    }

    result = props.insert_one(doc)
    print(f"Inserted _id={result.inserted_id}, image={chosen_path}")

print("✅ All properties imported with local images.")
