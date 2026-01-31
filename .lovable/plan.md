

## Plan: Admin Site Content Management

### Overview
Add a new admin section where administrators can edit static text displayed on public-facing pages. This will allow content updates without code changes, making it easy to customize messaging for each read-a-thon event.

### Editable Content Identified

Based on exploration of the codebase, the following static text would benefit from admin editing:

**Home Page (`HomePage.tsx`)**
- Hero headlines (currently hardcoded array)
- Hero description paragraph
- Stats section values (Minutes Logged, Books Completed, Funds Raised)
- "How It Works" steps descriptions
- "Making a Difference" section with funding list
- CTA section text

**About Page (`AboutPage.tsx`)**
- Mission statement text
- Statistics (Students, Minutes, Books, Since year)
- Values section descriptions
- Privacy & Safety description

**How It Works Page (`HowItWorksPage.tsx`)**
- Step descriptions and details
- Stats section values

**FAQ Page (`FAQPage.tsx`)**
- FAQ questions and answers

**Privacy Page (`PrivacyPage.tsx`)**
- Various policy sections (likely less frequently edited)

---

### Implementation Approach

#### Phase 1: Database Schema

Create a new `site_content` table to store editable content:

```text
+------------------+
|   site_content   |
+------------------+
| id (uuid, PK)    |
| key (text)       | <-- unique identifier like "home.hero_description"
| value (text)     | <-- the content (supports markdown for rich text)
| content_type     | <-- 'text' | 'json' (for arrays like FAQs, stats)
| description      | <-- admin hint about what this content is
| updated_at       |
| updated_by       |
+------------------+
```

RLS policies:
- SELECT: Anyone can read (content is public)
- INSERT/UPDATE/DELETE: Admin only

#### Phase 2: Admin UI Component

Add a new "Site Content" section within the existing Admin Settings page (`/admin/settings`). The section will include:

1. **Collapsible content groups** organized by page:
   - Home Page Content
   - About Page Content
   - How It Works Content
   - FAQ Content

2. **Content editor for each item**:
   - Text fields for simple content
   - Textarea for longer content (mission statement, descriptions)
   - JSON editor or structured form for arrays (stats, FAQs, steps)

3. **Save mechanism**:
   - Individual save per content item, OR
   - Bulk save with unsaved changes tracking (matching existing settings pattern)

#### Phase 3: Content Hook

Create a `useSiteContent` hook:

```text
useSiteContent(key: string) => { value, isLoading }
useSiteContent(keys: string[]) => { content: Record<string, string>, isLoading }
```

The hook will:
- Fetch content from the `site_content` table
- Cache results using React Query
- Provide fallback to hardcoded defaults if content not found

#### Phase 4: Update Public Pages

Modify public pages to use the content hook:

```text
// Before
<p>Static hardcoded text here</p>

// After  
const { value: description } = useSiteContent('about.mission_description');
<p>{description || 'Fallback text'}</p>
```

---

### Technical Details

#### Database Migration

```sql
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  content_type TEXT NOT NULL DEFAULT 'text',
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site content"
  ON site_content FOR SELECT USING (true);

CREATE POLICY "Admins can manage site content"
  ON site_content FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
```

#### Seed Data

Pre-populate with current hardcoded values so admins see existing content:

| Key | Content Type | Description |
|-----|--------------|-------------|
| `home.hero_headlines` | json | Hero section rotating headlines |
| `home.hero_description` | text | Main description under headline |
| `home.stats` | json | Stats display (minutes, books, funds) |
| `about.mission_text` | text | Our Mission section content |
| `about.statistics` | json | Platform statistics grid |
| `faq.items` | json | All FAQ questions and answers |
| ... | ... | ... |

#### Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/useSiteContent.ts` | React Query hook for fetching content |
| `src/components/admin/SiteContentEditor.tsx` | Admin UI for editing content |

#### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/admin/AdminSettingsPage.tsx` | Add Site Content section |
| `src/pages/HomePage.tsx` | Use useSiteContent for dynamic text |
| `src/pages/AboutPage.tsx` | Use useSiteContent for dynamic text |
| `src/pages/HowItWorksPage.tsx` | Use useSiteContent for dynamic text |
| `src/pages/FAQPage.tsx` | Use useSiteContent for dynamic text |
| `src/integrations/supabase/types.ts` | Auto-updated with new table types |

---

### UI Design

The Site Content section in Admin Settings will follow the existing hand-drawn card pattern:

```text
┌─────────────────────────────────────────────────────┐
│  📝 Site Content                                    │
│  Edit text displayed on public pages                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ▼ Home Page                                        │
│    ┌───────────────────────────────────────────┐   │
│    │ Hero Headlines                             │   │
│    │ [Textarea with JSON array]                 │   │
│    └───────────────────────────────────────────┘   │
│    ┌───────────────────────────────────────────┐   │
│    │ Hero Description                           │   │
│    │ [Textarea]                                 │   │
│    └───────────────────────────────────────────┘   │
│                                                     │
│  ▶ About Page                                       │
│  ▶ FAQ Page                                         │
│  ▶ How It Works                                     │
│                                                     │
│                              [ Save All Changes ]   │
└─────────────────────────────────────────────────────┘
```

---

### Considerations

1. **Fallback Strategy**: All content lookups will have hardcoded fallbacks, ensuring the site works even if the database is empty or a key is missing

2. **Content Validation**: For JSON content types (arrays like FAQs, stats), the editor will validate JSON syntax before saving

3. **Performance**: Content will be cached with React Query and refreshed on page load - no realtime updates needed

4. **Scope Control**: Start with the most commonly edited content (home page, about stats), then expand to full FAQ and detailed page content

