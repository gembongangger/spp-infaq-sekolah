# Deployment Guide: Netlify + Turso

This guide will walk you through deploying the SvelteKit Infaq application to Netlify with Turso as the database.

## Prerequisites

1. **Netlify Account** - Sign up at [netlify.com](https://www.netlify.com/)
2. **Turso Account** - Sign up at [turso.tech](https://turso.tech/)
3. **Node.js** - Version 18 or higher
4. **Git** - For version control and deployment

## Step 1: Set Up Turso Database

### 1.1 Install Turso CLI

```bash
# macOS
brew install tursodatabase/tap/turso

# Windows (with scoop)
scoop bucket add tursodatabase https://github.com/tursodatabase/scoop
scoop install turso

# Or download from https://docs.turso.tech/turso-cli/installation
```

### 1.2 Login to Turso

```bash
turso auth login
```

### 1.3 Create a Database

```bash
# Create a new database
turso db create infaq-jariyah

# Get the database URL
turso db show infaq-jariyah --url
```

### 1.4 Create Auth Token

```bash
# Create an authentication token
turso db tokens create infaq-jariyah
```

**Save both the URL and token** - you'll need them for Netlify configuration.

### 1.5 Initialize Database Schema

The application will automatically create tables on first run via the migration script. However, if you want to manually set up the schema, you can use:

```bash
# Connect to your database
turso db shell infaq-jariyah

# Run the schema creation commands (from src/lib/server/db/migrate.ts)
# The migration will run automatically on first deployment
```

## Step 2: Prepare Your Repository

### 2.1 Commit Changes

```bash
git add .
git commit -m "Migrate to Turso and prepare for Netlify deployment"
git push origin main
```

### 2.2 Ensure .gitignore is Proper

Make sure your `.gitignore` includes:

```
node_modules/
.env
.env.local
*.db
*.db-journal
.netlify/
build/
```

## Step 3: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Go to Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com/)

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Authorize Netlify to access your repository

3. **Configure Build Settings**
   - **Repository**: Select your repository
   - **Branch**: `main` (or your production branch)
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

4. **Set Environment Variables**
   
   Go to **Site configuration** → **Environment variables** and add:

   ```
   TURSO_CONNECTION_URL=libsql://your-database-name.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   SESSION_SECRET=your-random-secret-key
   NODE_ENV=production
   ```

   **Important**: 
   - Replace `your-database-name.turso.io` with your actual Turso URL
   - Replace `your-auth-token-here` with your Turso token
   - Generate a strong `SESSION_SECRET` (at least 32 characters)

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (usually 2-5 minutes)

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize your site
netlify init

# Set environment variables
netlify env:set TURSO_CONNECTION_URL "libsql://your-database-name.turso.io"
netlify env:set TURSO_AUTH_TOKEN "your-auth-token-here"
netlify env:set SESSION_SECRET "your-random-secret-key"

# Deploy
netlify deploy --prod
```

## Step 4: Verify Deployment

### 4.1 Check Build Logs

After deployment, check the Netlify build logs for any errors:
- Go to your site in Netlify dashboard
- Click on "Deploys" tab
- Click on the latest deploy
- Review the build log

### 4.2 Test Database Connection

Visit your site's URL and navigate to:
```
https://your-site.netlify.app/api/health
```

You should see:
```json
{
  "success": true,
  "message": "API is running",
  "database": "connected"
}
```

### 4.3 Test Application Features

1. **Login** - Try logging in with existing credentials
2. **Create Data** - Try creating a new transaction
3. **View Data** - Check if data is being saved correctly

## Step 5: Configure Custom Domain (Optional)

1. Go to **Site configuration** → **Domain management**
2. Click "Add custom domain"
3. Follow the instructions to configure DNS
4. Netlify will automatically provision SSL certificate

## Step 6: Set Up Continuous Deployment

Netlify automatically sets up continuous deployment. Every push to your configured branch will trigger a new deployment.

### Manual Deploy Triggers

If you need to manually trigger a deployment:
```bash
netlify deploy --prod
```

Or in the Netlify dashboard, click "Trigger deploy" → "Deploy site".

## Troubleshooting

### Issue: Database Connection Failed

**Symptoms**: Health check returns `database: "disconnected"`

**Solutions**:
1. Verify `TURSO_CONNECTION_URL` is correct (should start with `libsql://`)
2. Verify `TURSO_AUTH_TOKEN` is valid
3. Check Turso dashboard to ensure database is active
4. Check Netlify environment variables are set correctly

### Issue: Build Fails

**Symptoms**: Build process errors

**Solutions**:
1. Check build logs for specific error messages
2. Ensure all dependencies are in `package.json`
3. Run `npm run build` locally to test
4. Check Node.js version compatibility

### Issue: Session/Authentication Problems

**Symptoms**: Users can't login or sessions don't persist

**Solutions**:
1. Ensure `SESSION_SECRET` is set in environment variables
2. Make sure `SESSION_SECRET` is a strong, random string
3. Clear browser cookies and try again

### Issue: Migration Not Running

**Symptoms**: Tables don't exist on first run

**Solutions**:
The migration runs automatically when the server starts. Check:
1. Netlify function logs for migration output
2. Ensure migration file exists at `src/lib/server/db/migrate.ts`
3. Check for migration errors in logs

## Local Development with Turso

You can develop locally while using Turso database:

```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your Turso credentials
TURSO_CONNECTION_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
SESSION_SECRET=local-dev-secret-key

# Run development server
npm run dev
```

Or use local SQLite for development:
```bash
# Don't set TURSO_CONNECTION_URL
# The app will fall back to local SQLite file
npm run dev
```

## Database Management

### Backup Your Database

```bash
# Export database
turso db dump infaq-jariyah > backup.sql

# Or use the Turso dashboard
```

### View Database Contents

```bash
# Connect to database shell
turso db shell infaq-jariyah

# Run queries
SELECT * FROM user;
SELECT * FROM transaksi;
```

### Reset Database

If you need to start fresh:

```bash
# Delete and recreate database
turso db delete infaq-jariyah
turso db create infaq-jariyah

# Update your auth token
turso db tokens create infaq-jariyah

# Update Netlify environment variables
netlify env:set TURSO_AUTH_TOKEN "new-token-here"
```

## Performance Tips

1. **Use Database Groups** - For production, consider Turso groups for better performance
2. **Monitor Usage** - Check Turso dashboard for usage limits
3. **Optimize Queries** - The app already uses parameterized queries
4. **Enable Edge Functions** - For global performance, consider Netlify Edge Functions

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong SESSION_SECRET** - At least 32 random characters
3. **Rotate Turso tokens** - Periodically regenerate tokens
4. **Enable Netlify Identity** - For additional authentication layers
5. **Set up HTTPS** - Automatic with Netlify

## Support

- **Turso Documentation**: https://docs.turso.tech/
- **Netlify Documentation**: https://docs.netlify.com/
- **Turso Discord**: https://discord.com/invite/chV3pYsBtQ
- **SvelteKit Docs**: https://svelte.dev/docs/kit

## Migration Checklist

- [ ] Turso database created
- [ ] Auth token generated
- [ ] Environment variables set in Netlify
- [ ] Code committed and pushed
- [ ] Site deployed to Netlify
- [ ] Health check passing
- [ ] Login working
- [ ] Data operations verified
- [ ] Custom domain configured (optional)
- [ ] Continuous deployment verified
