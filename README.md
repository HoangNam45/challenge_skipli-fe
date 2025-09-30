Structure:

challenge_fe/  
├── public/  
├── src/  
│ ├── app/  
│ │ ├── dashboard/  
│ │ │ ├── owner/  
│ │ │ │ └── message/  
│ │ │ └── employee/  
│ │ └── account-setup/  
│ ├── components/  
│ │ ├── Chat/  
│ │ ├── Owner/  
│ │ └── Employee/  
│ ├── hooks/  
│ ├── services/  
│ └── contexts/  
├── package.json  
├── next.config.mjs  
├── jsconfig.json  
└── README.md

- src/app/\*\*: Next.js app directory, organizes all pages and routing logic for the application
- src/components/\*\*: Reusable React components for UI, split by feature/domain
- src/hooks/\*\*: Custom React hooks for encapsulating logic
- src/utils/\*\*: Logic that share for the entire project
- src/services/\*\*: Contains API and socket logic, split by domain
- src/contexts/\*\*: React context providers for global state management (e.g., AuthContext for authentication)
- public/\*\*: Static assets (images, icons, screenshots) served directly by Next.js

Setup & Run

1. git clone https://github.com/HoangNam45/challenge_skipli-fe.git
2. npm install
3. Configure environment variables  
   You have to create the .env file yourself(same level with src folder)  
   Then fill this env value into the file:

   NEXT_PUBLIC_API_BASE_URL='http://localhost:5000'

4. Start the server  
   For development: npm run dev  
   For production(better experience):  
    npm run build  
    npm run start

Screenshots

Landing Page  
![Landing Page](./public/landingpage.PNG)

## Owner

Owner Login  
![Owner Login](./public/ownerloginpage.PNG)

Verify Access Code

![Verify Access Code ](./public/verifyaccesscode.PNG)

Employee Management Page

![Employee Management Page](./public/EmployeeManagenebt.PNG)

Create Employee

![Create Employee](./public/CreateEmployee.PNG)

Edit Employee Profile

![Edit Employee Profile](./public/UpdateEmployee.PNG)

Task Management Page

![Task Management Page](./public/TaskManagement.PNG)

Assign Task To Employee

![Assign Task To Employee](./public/AssignTask.PNG)

Message With Employee Page

![Message With Employee Page](./public/Message.PNG)

![Chat Window](./public/ChatWindow.PNG)

## Employee

Invitation Mail

![Invitation Mail](./public/InvitationMail.PNG)

Account Setup Page

![Account Setup Page](./public/SetupAccount.PNG)

Employee Login Page

![Employee Login Page](./public/EmployeeLogin.PNG)

Employee Dashboard

![Employee Dashboard](./public/EmployeeDashboard.PNG)

Edit Profile

![Edit Profile](./public/EditProfile.PNG)

Chat With Owner

![Chat With Owner](./public/MessageWithOwner.PNG)

Notes

- Make sure your backend server is running and accessible at the API URL specified in your `.env`.
