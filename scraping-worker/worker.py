# AniCrew Scraping Worker - Railway/Heroku/VPS Deployment
import os
import asyncio
import json
import httpx
from datetime import datetime
from bs4 import BeautifulSoup
import re

# Configuration
ZENROWS_KEY = os.getenv("ZENROWS_API_KEY", "700c782d212580adba1fd15d82df6257ecb8701c")
CODEWORDS_API = "https://runtime.codewords.ai/anicrew_admin_panel_55416e72"
MONGO_URI = os.getenv("MONGO_URI")

# MongoDB setup
from motor.motor_asyncio import AsyncIOMotorClient
mongo_client = AsyncIOMotorClient(MONGO_URI) if MONGO_URI else None
db = mongo_client.anicrew if mongo_client else None

async def zenrows_get(url):
    params = {'url': url, 'apikey': ZENROWS_KEY, 'premium_proxy': 'true', 'js_render': 'true', 'wait': '2000'}
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.get('https://api.zenrows.com/v1/', params=params)
        return r.text if r.status_code == 200 else ""

async def scrape_series(series_url, source):
    html = await zenrows_get(series_url)
    soup = BeautifulSoup(html, 'html.parser')
    
    title = soup.find('h1')
    series_name = title.get_text(strip=True) if title else "Unknown"
    series_name = re.sub(r'Season.*|Hindi.*', '', series_name).strip()
    
    links = soup.find_all('a', href=True)
    episodes = []
    
    for link in links:
        text = link.get_text(strip=True)
        href = link.get('href', '')
        if 'episode' in text.lower():
            ep_match = re.search(r'(\d+)', text)
            if ep_match:
                episodes.append({'number': int(ep_match.group(1)), 'url': href})
    
    # Save to MongoDB
    if db:
        await db.series.update_one(
            {'series_url': series_url},
            {'$set': {'series_name': series_name, 'source': source, 'total_episodes': len(episodes), 'updated_at': datetime.utcnow()}},
            upsert=True
        )
        for ep in episodes:
            await db.episodes.update_one(
                {'series_name': series_name, 'episode_number': ep['number'], 'source': source},
                {'$set': {'episode_url': ep['url'], 'status': 'found', 'created_at': datetime.utcnow()}},
                upsert=True
            )
    
    print(f"✅ {series_name}: {len(episodes)} episodes")
    return episodes

async def main():
    print("🚀 AniCrew Worker Starting...")
    
    # Scrape AnimeDubHindi
    html = await zenrows_get("https://www.animedubhindi.me/")
    soup = BeautifulSoup(html, 'html.parser')
    
    links = [l.get('href') for l in soup.find_all('a', href=True) if 'season' in l.get_text(strip=True).lower()]
    
    print(f"📺 Found {len(links)} series")
    
    for series_url in links[:5]:
        await scrape_series(series_url, "ANIMEDUBHINDI")
        await asyncio.sleep(2)
    
    print("✅ Worker completed!")

if __name__ == "__main__":
    asyncio.run(main())
