# AniCrew Scraping Worker

## Deploy on Railway

### Quick Start

1. **Deploy to Railway:**
   - Click: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)
   - Select this repo
   - Choose `scraping-worker` directory

2. **Add Environment Variables:**
   ```
   ZENROWS_API_KEY=700c782d212580adba1fd15d82df6257ecb8701c
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/anicrew
   ```

3. **Get MongoDB (FREE):**
   - https://www.mongodb.com/cloud/atlas
   - Create M0 Free cluster
   - Copy connection string
   - Replace `<password>` with your password

### Features

- ✅ ZenRows Cloudflare bypass
- ✅ Series-based organization
- ✅ MongoDB episode tracking
- ✅ AnimeDubHindi scraping
- ✅ Parallel processing ready

### Run Locally

```bash
pip install -r requirements.txt
export ZENROWS_API_KEY=your_key
export MONGO_URI=your_mongo_uri
python worker.py
```

### Speed

- **1 worker:** 10-15 episodes/day
- **5 workers:** 50-75 episodes/day
- **10 workers:** 100-150 episodes/day

### Deploy Multiple Workers

1. Deploy once on Railway
2. Clone the service 5-10 times
3. Each runs in parallel
4. Speed multiplied!
