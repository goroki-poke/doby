# JSON-LD Schema Generator API

Generates Google-compliant JSON-LD structured data from raw page metadata, blog content, or product details.

## API Endpoints

### `POST /api/json-ld`

Generate JSON-LD schema markup from input data.

**Request body:**
```json
{
  "type": "auto | article | product | organization | webpage | event | faq",
  "data": { ... }
}
```

**Response (200):**
```json
{
  "jsonld": { "@context": "https://schema.org", ... }
}
```

**Response (400):**
```json
{
  "error": "Invalid input data provided."
}
```

### `GET /`

Health check and API information.

---

## Supported Types

| Type | Auto-detect triggers | Key fields |
|---|---|---|
| `article` | `headline`, `authorName`, `publisherName` | `headline`, `description`, `datePublished`, `authorName`, `publisherName`, `publisherLogo`, `image`, `articleBody` |
| `product` | `price`, `productName`, `sku`, `brand` | `name`, `description`, `price`, `currency`, `sku`, `brand`, `image`, `availability`, `ratingValue`, `ratingCount` |
| `organization` | `orgName`, `address`, `telephone` | `name`, `description`, `url`, `logo`, `streetAddress`, `addressLocality`, `telephone`, `email`, `sameAs` |
| `webpage` | `pageTitle`, `url`, `breadcrumbs` | `pageTitle`, `description`, `url`, `breadcrumbs[]`, `siteName`, `potentialActionTarget` |
| `event` | `eventName`, `startDate`, `venueName` | `name`, `startDate`, `endDate`, `description`, `venueName`, `venueStreetAddress`, `price`, `performerName` |
| `faq` | `questions[]`, `faq[]`, `question`+`answer` arrays | `questions: [{question, answer}]` or parallel `question[]` + `answer[]` |
| `auto` | Auto-detects from fields above | (any of the above) |

---

## Deployment

### Deploy to Render

1. Push this repo to GitHub
2. Create a new **Web Service** on Render
3. Connect your repository
4. Render auto-detects `render.yaml` — or manually set:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### Deploy to Railway

```bash
railway login
railway init
railway up
```

### Deploy to RapidAPI

1. Deploy the API to any cloud provider (Render, Railway, Fly.io, etc.)
2. Go to [RapidAPI Hub](https://rapidapi.com/hub)
3. Click **"Add New API"**
4. Enter your deployed API base URL
5. Define the `POST /api/json-ld` endpoint:
   - **Request body:** `application/json` with `{ "type": "...", "data": {...} }`
   - **Response:** `application/json`
6. Publish to Hub

---

## Local Development

```bash
npm run dev        # starts with hot reload on localhost:3001
```

## Testing with curl

```bash
# Product
curl -X POST http://localhost:3001/api/json-ld \
  -H "Content-Type: application/json" \
  -d '{"type":"product","data":{"name":"Wireless Headphones","description":"Noise-cancelling","price":99.99,"currency":"USD","brand":"AudioPro","availability":"InStock"}}'

# Article
curl -X POST http://localhost:3001/api/json-ld \
  -H "Content-Type: application/json" \
  -d '{"type":"article","data":{"headline":"Understanding JSON-LD","description":"A guide","datePublished":"2026-05-26","authorName":"John Doe","publisherName":"Tech Blog","publisherLogo":"https://example.com/logo.png"}}'

# Auto-detect (FAQ)
curl -X POST http://localhost:3001/api/json-ld \
  -H "Content-Type: application/json" \
  -d '{"type":"auto","data":{"questions":[{"question":"What is JSON-LD?","answer":"JSON for linked data."},{"question":"Is it required?","answer":"Yes, for rich results."}]}}'

# Invalid input
curl -X POST http://localhost:3001/api/json-ld \
  -H "Content-Type: application/json" \
  -d '{"type":"product","data":{}}'
```
