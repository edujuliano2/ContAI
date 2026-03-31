# ContAI - Gestão de Finanças Pessoais

## 1. Project Overview

- **Project name**: ContAI
- **Type**: Web Application (SaaS Dashboard)
- **Core functionality**: Personal and family finance management with expense tracking, categorization, and visual analytics
- **Target users**: Individuals and families managing personal finances

## 2. UI/UX Specification

### Layout Structure

- **Sidebar**: Fixed left sidebar (280px desktop, collapsible mobile)
- **Header**: Top bar with user info, search, and family member filter
- **Main Content**: Fluid width with max-width 1400px
- **Responsive breakpoints**:
  - Mobile: < 768px (sidebar hidden, hamburger menu)
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Visual Design

**Color Palette**:
- Background: `#0F0F0F` (dark mode primary)
- Surface: `#1A1A1A` (cards, sidebar)
- Surface Elevated: `#252525` (hover states)
- Primary: `#10B981` (emerald green - income/positive)
- Danger: `#EF4444` (red - expenses)
- Warning: `#F59E0B` (amber)
- Text Primary: `#FFFFFF`
- Text Secondary: `#A1A1AA`
- Border: `#2D2D2D`

**Typography**:
- Font Family: `"Outfit", sans-serif`
- Headings: 600 weight
- Body: 400 weight
- Sizes: h1 (32px), h2 (24px), h3 (18px), body (14px), small (12px)

**Spacing System**: 4px base unit (4, 8, 12, 16, 24, 32, 48)

**Visual Effects**:
- Card shadows: `0 4px 24px rgba(0,0,0,0.4)`
- Border radius: 12px (cards), 8px (buttons/inputs)
- Transitions: 200ms ease

### Components

1. **Sidebar Navigation**
   - Logo + app name
   - Nav items: Dashboard, Lançamentos, Relatórios
   - Family member selector
   - User profile/logout

2. **Stat Cards**
   - Icon, label, value, trend indicator
   - 4 cards in a row (2x2 on tablet, 1x4 on mobile)

3. **Charts**
   - Pie chart: Category distribution
   - Line chart: Expenses over time
   - Bar chart: Category ranking
   - Recharts library

4. **Data Table**
   - Sortable columns
   - Row actions (edit, delete)
   - Pagination
   - Empty state

5. **Forms**
   - Modal for create/edit
   - Floating labels
   - Validation feedback

6. **Filters Bar**
   - Date range picker
   - Category dropdown
   - Search input
   - Member filter

## 3. Functionality Specification

### Authentication
- Login with email/password via Supabase Auth
- Session persistence with localStorage
- Protected routes with redirect to login

### CRUD Operations
- **Create**: Modal form with fields (valor, despesa, categoria, zap)
- **Read**: List view with filters, pagination
- **Update**: Same modal, pre-filled
- **Delete**: Confirmation dialog

### Filters & Sorting
- Date range: start date, end date
- Category: dropdown with all categories
- Search: text search on "despesa"
- Member (zap): filter by family member
- Sort: by date (asc/desc), by value (asc/desc)

### Dashboard Metrics
- Total spent in period
- Daily average
- Total by category (top 5)
- Recent transactions (last 5)
- Month-over-month evolution

### Charts
- Pie: Category breakdown
- Line: Daily expenses (last 30 days)
- Bar: Top 5 categories by value

### Rankings
- Top categories (total spent)
- Largest individual expenses
- Ranking by member (zap)

### Family Mode
- Multi-user support via "zap" field
- Filter by member
- Combined family view

## 4. Data Schema

### Table: lancamentos
```sql
id: int8 (primary key)
created_at: timestamptz (default now())
valor: numeric (required, positive)
despesa: text (required)
categoria: text (required)
zap: text (optional - family member identifier)
user_id: uuid (foreign key to auth.users)
```

### RLS Policies
- Users can only see their own records
- Users can only update/delete their own records

## 5. Acceptance Criteria

1. ✅ User can register and login
2. ✅ User can create, edit, delete expenses
3. ✅ Dashboard shows correct metrics
4. ✅ Charts render with real data
5. ✅ Filters work correctly
6. ✅ Responsive on mobile/tablet
7. ✅ Session persists on refresh
8. ✅ Family member filtering works
