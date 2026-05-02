from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = None
db = None

async def connect_db():
    """Connect to MongoDB."""
    global client, db
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        # Verify connection
        await client.admin.command('ping')
        print(f"[OK] Connected to MongoDB: {settings.DATABASE_NAME}")
    except Exception as e:
        print(f"[WARN] MongoDB connection failed: {e}")
        print("[INFO] Running in demo mode with in-memory data")

async def close_db():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        print("[INFO] MongoDB connection closed")

def get_db():
    """Get database instance."""
    return db
