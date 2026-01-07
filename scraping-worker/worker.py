# AniCrew Scraping Worker - Railway/Heroku Deployment
import os
import asyncio
import json
import httpx
from datetime import datetime
from bs4 import BeautifulSoup
import re

# Configuration
ZENROWS_KEY = os.getenv("ZENROWS_API_KEY", "700c782d212580adba1fd15d82df6257ecb8701c")
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://wuwamuqo_db_user:NfhgBOs7LeRbSI6S@cluster0.zxqopbx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

# Sites with ZenRows URLs
SITES = {
    "LORDSANIME": "https://www.lordsanime.in/all-anime-list/",
    "TPXSUB": "https://www.tpxsub.com/animes-in-hindi-sub/",
    "ANIMEDUBHINDI": "https://www.animedubhindi.me/",
}

# MongoDB setup
from motor.motor_asyncio import AsyncIOMotorClient
mongo_client = AsyncIOMotorClient(MONGO_URI)
db = mongo_client.anicrew

print(f"🗄️  MongoDB connected: {MONGO_URI[:50]}...")

async def zenrows_get(url, mode='auto'):
    """Fetch URL with ZenRows."""
    params = {
        'url': url,
        'apikey': ZENROWS_KEY,
    }
    
    # Add mode-specific params
    if mode == 'auto':
        params['mode'] = 'auto'
    else:
        params['premium_proxy'] = 'true'
        params['js_render'] = 'true'
        params['wait'] = '2000'
    
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.get('https://api.zenrows.com/v1/', params=params)
        if r.status_code == 200:
            return r.text
        print(f"❌ ZenRows error {r.status_code}: {r.text[:200]}")
        return ""

async def scrape_series_page(series_url, source):
    """Scrape anime series page for episodes."""
    html = await zenrows_get(series_url, mode='premium')
    if not html:
        return None
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Extract series title
    title = soup.find('h1') or soup.find('title')
    series_name = title.get_text(strip=True) if title else "Unknown"
    series_name = re.sub(r'(Season|Hindi|Tamil|Telugu).*', '', series_name, flags=re.IGNORECASE).strip()
    
    # Find episode links
    links = soup.find_all('a', href=True)
    episodes = []
    
    for link in links:
        text = link.get_text(strip=True)
        href = link.get('href', '')
        
        # Look for episode patterns
        if 'episode' in text.lower() or 'episode' in href.lower():
            ep_match = re.search(r'(\d+)', text)
            if ep_match:
                episodes.append({
                    'number': int(ep_match.group(1)),
                    'url': href if href.startswith('http') else series_url.rsplit('/', 1)[0] + '/' + href,
                    'title': text[:100]
                })
    
    # Remove duplicates
    seen = set()
    unique_episodes = []
    for ep in episodes:
        if ep['number'] not in seen:
            seen.add(ep['number'])
            unique_episodes.append(ep)
    
    episodes = sorted(unique_episodes, key=lambda x: x['number'])
    
    # Save to MongoDB
    await db.series.update_one(
        {'series_url': series_url},
        {'$set': {
            'series_name': series_name,
            'source': source,
            'total_episodes': len(episodes),
            'updated_at': datetime.utcnow()
        }},
        upsert=True
    )
    
    # Save episodes
    for ep in episodes:
        await db.episodes.update_one(
            {'series_name': series_name, 'episode_number': ep['number'], 'source': source},
            {'$set': {
                'episode_url': ep['url'],
                'episode_title': ep['title'],
                'status': 'found',
                'created_at': datetime.utcnow()
            }},
            upsert=True
        )
    
    print(f"✅ {series_name}: {len(episodes)} episodes tracked")
    return {'series_name': series_name, 'episodes': episodes}

async def scrape_site(source):
    """Scrape anime list from site."""
    site_url = SITES.get(source)
    if not site_url:
        print(f"Unknown source: {source}")
        return
    
    print(f"\n🚀 Scraping {source}: {site_url}")
    
    # Determine mode based on source
    mode = 'auto' if source == "LORDSANIME" else 'premium'
    html = await zenrows_get(site_url, mode=mode)
    
    if not html:
        print(f"❌ Failed to fetch {source}")
        return
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Find anime series links
    links = soup.find_all('a', href=True)
    series_links = []
    
    for link in links:
        href = link.get('href', '')
        text = link.get_text(strip=True)
        
        # Look for series pages
        if ('season' in text.lower() or 'series' in text.lower() or 
            'anime' in href.lower() or len(text) > 10):
            if href.startswith('http'):
                series_links.append(href)
    
    # Remove duplicates
    series_links = list(set(series_links))
    
    print(f"📺 Found {len(series_links)} anime series")
    
    # Process first 5 series
    for series_url in series_links[:5]:
        try:
            await scrape_series_page(series_url, source)
            await asyncio.sleep(3)  # Rate limiting
        except Exception as e:
            print(f"❌ Error: {e}")

async def main():
    print("="*70)
    print("🎬 AniCrew Scraping Worker Starting...")
    print("="*70)
    
    # Test MongoDB
    try:
        await db.command('ping')
        print("✅ MongoDB connected!\n")
    except Exception as e:
        print(f"❌ MongoDB error: {e}\n")
    
    # Scrape all sources
    for source in ["LORDSANIME", "TPXSUB", "ANIMEDUBHINDI"]:
        await scrape_site(source)
        print()
    
    # Print stats
    series_count = await db.series.count_documents({})
    episodes_count = await db.episodes.count_documents({})
    
    print("\n" + "="*70)
    print("📊 STATS")
    print("="*70)
    print(f"Total Series: {series_count}")
    print(f"Total Episodes: {episodes_count}")
    print("="*70)
    print("✅ Worker completed!")
    print("="*70)

if __name__ == "__main__":
    asyncio.run(main())
