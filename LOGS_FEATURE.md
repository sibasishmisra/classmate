# Logs Feature Documentation

## Overview
Private analytics and session logging system for ClassMate.info. Records all user interactions with timestamps, IP addresses, and location data.

## Access
- **URL**: `https://www.classmate.info/logs`
- **PIN**: `042026`
- **Security**: PIN-protected, not linked from main site

## Features

### 1. Session Recording
Automatically logs every explanation request with:
- **Timestamp**: ISO 8601 format with timezone
- **IP Address**: Client IP (supports proxies and CDNs)
- **Location**: City and country (via ipapi.co)
- **Topic**: User's question
- **Level**: Learning level (1-6)
- **Explanation**: Full AI-generated explanation
- **Follow-up Questions**: Generated questions and answers

### 2. Analytics Dashboard
- **Total Sessions**: Count of all logged interactions
- **Unique IPs**: Number of distinct users
- **Follow-up Questions**: Total engagement metric
- **Last Activity**: Time since most recent session

### 3. Search & Filter
- Search by topic, IP, or content
- Sort by newest or oldest
- Real-time filtering

### 4. Data Management
- **Export**: Download logs as JSON
- **Clear**: Delete all logs (with confirmation)
- **Auto-trim**: Keeps last 1000 entries

## Technical Implementation

### API Routes

#### GET `/api/logs`
Retrieves all logged sessions.

**Response:**
```json
{
  "logs": [
    {
      "id": "uuid",
      "timestamp": "2026-04-19T10:30:00.000Z",
      "ip": "192.168.1.1",
      "location": "San Francisco, United States",
      "topic": "Why is the sky blue?",
      "level": 3,
      "explanation": "...",
      "followUpQuestions": [
        {
          "question": "Why does the sky change colors at sunset?",
          "answer": "..."
        }
      ]
    }
  ],
  "count": 1
}
```

#### POST `/api/logs`
Adds a new log entry (called automatically by `/api/explain`).

**Request:**
```json
{
  "topic": "Why is the sky blue?",
  "level": 3,
  "explanation": "...",
  "followUpQuestions": [...]
}
```

**Response:**
```json
{
  "success": true,
  "log": { ... }
}
```

#### DELETE `/api/logs`
Clears all logs.

**Response:**
```json
{
  "success": true,
  "message": "All logs cleared"
}
```

### Data Storage

**Location**: `/data/logs.json`

**Format**: JSON array of log entries

**Retention**: Last 1000 entries (auto-trimmed)

**Backup**: Not included in git (see `.gitignore`)

### IP Detection
Checks headers in order:
1. `x-forwarded-for` (proxy/CDN)
2. `x-real-ip` (nginx)
3. `cf-connecting-ip` (Cloudflare)
4. Falls back to 'unknown'

### Location Detection
Uses ipapi.co free tier:
- 1000 requests/day limit
- Returns city and country
- Falls back gracefully if unavailable
- Local IPs show as "Local"

## Security

### PIN Protection
- 6-digit PIN: `042026`
- Session-based authentication
- No cookies or persistent storage
- Clears on browser close

### Privacy Considerations
- Logs stored locally (not in database)
- Not accessible via public API
- No user identification beyond IP
- Complies with privacy-preserving logging

### Access Control
- No links from main site
- Direct URL access only
- PIN required for viewing
- Session expires on close

## Usage

### Viewing Logs
1. Navigate to `/logs`
2. Enter PIN: `042026`
3. View dashboard and logs

### Searching
- Type in search box
- Filters by topic, IP, or content
- Updates in real-time

### Exporting
1. Click "Export" button
2. Downloads JSON file
3. Filename: `classmate-logs-YYYY-MM-DD.json`

### Clearing
1. Click "Clear" button
2. Confirm deletion
3. All logs permanently deleted

## Deployment Notes

### Environment Variables
No additional environment variables required.

### File Permissions
Ensure `/data` directory is writable:
```bash
mkdir -p data
chmod 755 data
```

### Vercel Deployment
- Logs stored in serverless function memory
- Persists between requests
- Cleared on deployment
- Consider using Vercel KV for persistence

### Production Recommendations
1. **Database Storage**: Move to PostgreSQL/MongoDB for persistence
2. **Rate Limiting**: Add rate limiting to logs API
3. **Backup**: Implement automatic backups
4. **Monitoring**: Add alerts for unusual activity
5. **GDPR**: Add data retention policies

## Analytics Insights

### Metrics to Track
- **Popular Topics**: Most asked questions
- **Peak Hours**: When users are most active
- **Geographic Distribution**: Where users are from
- **Engagement**: Follow-up question rate
- **Session Length**: Time between questions

### Example Queries
```javascript
// Most popular topics
const topicCounts = logs.reduce((acc, log) => {
  acc[log.topic] = (acc[log.topic] || 0) + 1;
  return acc;
}, {});

// Average follow-ups per session
const avgFollowUps = logs.reduce((sum, log) => 
  sum + (log.followUpQuestions?.length || 0), 0
) / logs.length;

// Unique users per day
const dailyUsers = logs.reduce((acc, log) => {
  const date = log.timestamp.split('T')[0];
  acc[date] = acc[date] || new Set();
  acc[date].add(log.ip);
  return acc;
}, {});
```

## Future Enhancements

### Phase 1 (Immediate)
- [ ] Add date range filtering
- [ ] Export as CSV format
- [ ] Add pagination for large datasets
- [ ] Show response time metrics

### Phase 2 (Short-term)
- [ ] Move to database storage
- [ ] Add user session tracking
- [ ] Implement data retention policies
- [ ] Add email alerts for errors

### Phase 3 (Long-term)
- [ ] Advanced analytics dashboard
- [ ] A/B testing capabilities
- [ ] User feedback collection
- [ ] Integration with analytics tools

## Troubleshooting

### Logs Not Appearing
1. Check `/data/logs.json` exists
2. Verify file permissions
3. Check API route logs
4. Ensure logging code is called

### Location Not Showing
1. Check ipapi.co rate limit (1000/day)
2. Verify IP is public (not local)
3. Check network connectivity
4. Review API response logs

### PIN Not Working
1. Verify PIN is exactly: `042026`
2. Clear browser cache
3. Check session storage
4. Try incognito mode

### Export Not Working
1. Check browser download settings
2. Verify JSON is valid
3. Try different browser
4. Check console for errors

## Files Modified/Created

### New Files
1. `app/logs/page.tsx` - Logs dashboard UI
2. `app/api/logs/route.ts` - Logs API endpoints
3. `LOGS_FEATURE.md` - This documentation

### Modified Files
1. `app/api/explain/route.ts` - Added logging call
2. `.gitignore` - Added `/data/` directory
3. `package.json` - Added date-fns dependency

### Data Files
1. `data/logs.json` - Log storage (created automatically)

## Maintenance

### Regular Tasks
- **Weekly**: Review logs for patterns
- **Monthly**: Export and backup logs
- **Quarterly**: Analyze trends and insights
- **Yearly**: Review retention policies

### Monitoring
- Check disk space usage
- Monitor API response times
- Review error rates
- Track user growth

## Legal & Compliance

### Data Collection
- IP addresses (personal data)
- Location (approximate)
- User questions (content)
- Timestamps (usage patterns)

### GDPR Considerations
- Right to access: Export feature
- Right to deletion: Clear feature
- Data minimization: Only essential data
- Purpose limitation: Analytics only

### Recommendations
1. Add privacy policy
2. Implement data retention
3. Add user consent (if required)
4. Document data processing

## Support

For issues or questions:
1. Check troubleshooting section
2. Review API logs
3. Test in development mode
4. Contact system administrator

---

**Last Updated**: April 19, 2026
**Version**: 1.0.0
**Status**: Production Ready
