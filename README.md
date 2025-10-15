# Al-Azhar Online School Management System

A comprehensive educational management system built with Next.js, TypeScript, and Tailwind CSS for managing online Quran classes and Islamic education.

## Features

### 🎓 Student Management
- Complete student profiles with contact information
- Enrollment tracking and status management
- Academic progress monitoring
- Parent/guardian information management

### 👨‍🏫 Teacher Management
- Teacher profiles with qualifications and specializations
- Subject expertise tracking
- Hourly rate management
- Performance analytics

### 📅 Class Scheduling
- Interactive calendar view
- Class booking and management
- Automated scheduling conflicts detection
- Time zone support

### 💰 Payment Management
- Fee tracking and payment history
- Automated billing calculations
- Payment status monitoring
- Financial reporting

### 📊 Analytics & Reporting
- Student progress reports
- Teacher performance metrics
- Financial analytics
- Attendance tracking

### 🔔 Trial Classes
- Trial class scheduling
- Conversion tracking
- Lead management
- Follow-up automation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Form Handling**: React Hook Form
- **State Management**: React Context + Hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (optional - system works with mock data)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/alazhar-school-system.git
cd alazhar-school-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your environment variables in `.env.local`:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup (Optional)

The system works with mock data by default. To use a real database:

1. Create a Supabase project
2. Run the SQL scripts in the `scripts/` folder
3. Update your environment variables
4. The system will automatically switch to using Supabase

### Database Schema

The system uses the following main tables:
- `students` - Student information and enrollment data
- `teachers` - Teacher profiles and qualifications
- `classes` - Class schedules and sessions
- `trial_classes` - Trial class bookings
- `payments` - Payment records and billing
- `attendance` - Class attendance tracking
- `certificates` - Student certificates and achievements

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard layout group
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── modals/           # Modal components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── database.ts       # Database operations
│   ├── utils.ts          # General utilities
│   └── supabase.ts       # Supabase client
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── scripts/              # Database scripts
└── public/               # Static assets
\`\`\`

## Key Components

### Dashboard
- Overview statistics
- Recent activities
- Upcoming classes
- Quick actions

### Student Management
- Student list with filtering and search
- Individual student profiles
- Enrollment management
- Progress tracking

### Teacher Management
- Teacher directory
- Profile management
- Subject assignments
- Performance metrics

### Class Scheduling
- Calendar view
- Class booking
- Schedule management
- Conflict resolution

### Trial Classes
- Trial booking system
- Conversion tracking
- Lead management
- Follow-up workflows

## API Routes

- `/api/dashboard/stats` - Dashboard statistics
- `/api/schedule/today` - Today's schedule
- `/api/students` - Student CRUD operations
- `/api/teachers` - Teacher CRUD operations
- `/api/classes` - Class management
- `/api/payments` - Payment processing

## Customization

### Styling
The system uses Tailwind CSS with a custom design system. Colors and styling can be customized in:
- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - Global styles and CSS variables

### Database
Database operations are abstracted in `lib/database.ts`. You can:
- Switch between Supabase and mock data
- Add new database operations
- Modify data structures

### Components
All UI components are built with shadcn/ui and can be customized:
- Modify existing components in `components/ui/`
- Add new components following the same patterns
- Customize styling with Tailwind classes

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The system can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database powered by [Supabase](https://supabase.com/)
