
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/fbf0ab7b-9057-477f-be66-8369f95a888b

## System Architecture

This CRM is built with a modern stack:

1. **Frontend (React + TypeScript)**
   - Hosted on your VPS via EasyPanel
   - Provides the user interface that clients interact with

2. **Backend (Appwrite)**
   - Hosted on your VPS as a separate service
   - Handles authentication, database, storage, and functions

### Key Technologies

- **React**: Frontend UI library
- **TypeScript**: Type-safe JavaScript
- **Appwrite**: Backend-as-a-Service for authentication, database, storage
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and state management

## Deployment Instructions

### Step 1: Configure Appwrite

1. Set up an Appwrite instance on your VPS or use Appwrite Cloud
2. Create a project and note the Project ID
3. Create a database and note the Database ID
4. Set up collections for users, organizations, leads, etc.
5. Configure authentication methods

### Step 2: Configure Environment Variables

1. Create a `.env` file in the root directory based on the `.env.example` template
2. Fill in your Appwrite endpoint, project ID, and database ID

```
VITE_APPWRITE_ENDPOINT=https://your-appwrite-instance/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
```

### Step 3: GitHub Repository

1. Create a new GitHub repository
2. Push your code to the repository:

```sh
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### Step 4: Configure EasyPanel

1. Access your EasyPanel dashboard on your VPS
2. Create a new application
3. Select GitHub as the source
4. Configure the build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Set the environment variables from Step 2
6. Deploy the application

### Step 5: Configure Domain and SSL

1. In EasyPanel, configure your domain (e.g., crm.assistu.com.br)
2. Enable automatic SSL certificate generation

### Step 6: Test and Verify

1. Access your application at the configured domain
2. Verify authentication, data loading, and other functionality

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/fbf0ab7b-9057-477f-be66-8369f95a888b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/fbf0ab7b-9057-477f-be66-8369f95a888b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
