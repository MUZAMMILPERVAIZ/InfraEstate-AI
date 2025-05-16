from pymongo import MongoClient

# Your MongoDB URL
MONGO_URL = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URL)

# Select the database and collection
db = client.learning_ai

# Drop the collection
# db.drop_collection("users")
# db.drop_collection("user_bots")
#
# db.drop_collection("books")
# db.drop_collection("chapters")
# db.drop_collection("headings")
# db.drop_collection("grades")
# db.drop_collection("topics")
#
# db.drop_collection("tasks")
#
# db.drop_collection("events")
# db.drop_collection("courses")
# db.drop_collection("course_outlines")
#
# db.drop_collection("otps")
# db.drop_collection("tickets")
# db.drop_collection("ticket_messages")



db.drop_collection("bot_info")



print("The 'users' and 'user_bots' collection has been dropped.")
