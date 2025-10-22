# 🔐 Admin Dashboard Guide

## ✅ Your Account is Now Admin

**Email**: `hello@fergflannery.com`  
**Role**: `ADMIN` (upgraded from USER)  
**Handle**: `hello`

## 🚀 Accessing the Admin Dashboard

1. **Sign in** at: `https://mush-chi.vercel.app/auth/signin`
2. **Navigate to**: `https://mush-chi.vercel.app/admin`

The admin dashboard is protected - only users with `ADMIN` or `MODERATOR` roles can access it.

## 📊 Admin Dashboard Features

### 1. **Overview Tab** 📊
Get a quick snapshot of the entire system:
- **Glossary Terms** count
- **Species** count  
- **Pending Moderation** count (observations needing review)
- **Total Users** count

### 2. **Glossary Tab** 📚
Manage Irish mushroom terminology:
- **View all glossary terms** (Irish terms, meanings, categories)
- **Add new terms** with Irish name, English meaning, and category
- **Edit existing terms** to correct or enhance definitions
- **Delete terms** that are incorrect or duplicates
- **Categories include**: Mushroom Names, Mushroom Terms, Folklore, Nicknames

**Features**:
- Search and filter by category
- Grid layout for easy browsing
- Inline editing

### 3. **Species Tab** 🍄
Manage the mushroom species database:
- **View all 33 species** with full details
- **Add new species** with:
  - Latin name (scientific)
  - Common English name
  - Common Irish name (optional)
  - Edibility status (Choice, Edible, Caution, Toxic, Deadly, Unknown)
  - Season, habitat, key traits
  - Lookalike species
  - Sensitive species flag (for rare/endangered species)
  - Hero image URL
- **Edit species** to update information
- **Delete species** (with confirmation)
- **View identification counts** for each species

**Edibility Options**:
- 🟢 **CHOICE** - Premium edible
- 🟢 **EDIBLE** - Safe to eat
- 🟡 **CAUTION** - Requires expert preparation
- 🔴 **TOXIC** - Causes illness
- 💀 **DEADLY** - Fatal if consumed
- ⚪ **UNKNOWN** - Edibility not confirmed

### 4. **Moderation Tab** ⚖️
Review and moderate community observations:
- **Pending Queue**: Observations that need ID or have multiple candidate species
- **View submissions** with:
  - User who submitted
  - Photo and location
  - AI suggestions
  - Community identifications
  - Vote scores
  - Comments
- **Approve identifications** when consensus is reached
- **Flag inappropriate content** or misidentifications
- **Delete spam** or violating observations

**Observation Statuses**:
- 🔵 **NEEDS_ID** - No identifications yet
- 🟡 **HAS_CANDIDATES** - Multiple species suggested, no consensus
- 🟢 **CONSENSUS** - Community agreed on identification

### 5. **Users Tab** 👥
Manage user accounts and permissions:
- **View all users** with:
  - Email, handle, role
  - Reputation score
  - Observation count
  - Identification count
  - Join date
- **Change user roles**:
  - `USER` - Standard user (can submit, vote, comment)
  - `TRUSTED` - Trusted identifier (votes carry more weight)
  - `MODERATOR` - Can moderate content
  - `BIOLOGIST` - Expert mycologist (highest vote weight)
  - `ADMIN` - Full system access
- **Adjust reputation** scores
- **View user activity** and contributions

## 🛠️ Common Admin Tasks

### Adding a New Species

1. Go to **Species tab**
2. Click **"Add New Species"**
3. Fill in the form:
   ```
   Latin Name: Amanita muscaria
   Common English: Fly Agaric
   Common Irish: Caipín Dearg Cuileog
   Edibility: TOXIC
   Season: August-November
   Habitat: Under birch and pine trees
   Key Traits: Iconic red cap with white spots, white stem and gills
   ```
4. Click **"Save"**

### Moderating an Observation

1. Go to **Moderation tab**
2. Review the pending observation:
   - Check the photo quality
   - Review AI suggestions
   - Look at community identifications
   - Read any comments
3. Actions you can take:
   - **Upvote** good identifications (green +1 button)
   - **Downvote** incorrect identifications (red -1 button)
   - **Add your own identification** if you're certain
   - **Flag** for issues (inappropriate content, poor quality, etc.)
   - **Delete** if it violates guidelines

### Managing Glossary Terms

1. Go to **Glossary tab**
2. Filter by category if needed
3. To add a term:
   ```
   Irish Term: Caipín
   Meaning: Cap (the top part of a mushroom)
   Category: Mushroom Terms
   ```
4. To edit: Click edit icon, modify, save
5. To delete: Click delete icon, confirm

### Promoting a User to Trusted

1. Go to **Users tab**
2. Find the user (search by handle or email)
3. Click **"Change Role"**
4. Select **"TRUSTED"**
5. Confirm

This gives their votes more weight in the consensus algorithm.

## 🔒 Security Notes

- **Admin access** is logged for all actions
- **Role changes** should be done carefully
- **Species deletion** affects all related observations
- **User deletion** will cascade to their content
- Always **verify information** before approving

## 📱 Mobile Access

The admin dashboard is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices (though desktop is recommended for heavy editing)

## 🆘 Troubleshooting

**Can't access admin dashboard?**
- Make sure you're signed in with `hello@fergflannery.com`
- Check your role is `ADMIN` in the database
- Try signing out and back in to refresh your session

**Changes not appearing?**
- Refresh the page
- Check browser console for errors
- Verify database connection

**Need to give another user admin access?**
Run this SQL in Neon:
```sql
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'their-email@example.com';
```

## 📚 API Endpoints (for advanced use)

The admin dashboard uses these API routes:

- **Glossary**: `/api/glossary` (GET, POST, PUT, DELETE)
- **Species**: `/api/species` (GET, POST, PUT, DELETE)
- **Observations**: `/api/observations` (GET, PUT, DELETE)
- **Users**: `/api/user/settings` (GET, PUT)
- **Votes**: `/api/votes` (POST)

## 🎯 Next Steps

1. **Sign in** at `https://mush-chi.vercel.app/auth/signin`
2. **Visit** `https://mush-chi.vercel.app/admin`
3. **Explore** each tab to familiarize yourself
4. **Start moderating** community contributions
5. **Add species** as you expand the database
6. **Promote trusted users** to help with identification

---

**Admin Dashboard URL**: `https://mush-chi.vercel.app/admin`  
**Your Role**: ADMIN  
**Status**: ✅ Ready to use

